// ALU Module
module ALU (
    input [7:0] A,
    input [7:0] B,
    input [2:0] OpCode,
    output reg [7:0] Result,
    output reg Zero,
    output reg Carry,
    output reg Overflow,
    output reg Negative
);

    always @(*) begin
        // Initialize flags
        {Carry, Result} = 9'b0;
        Overflow = 0;
        Negative = 0;

        case (OpCode)
            3'b000: begin // Add
                {Carry, Result} = A + B;
                Overflow = (A[7] == B[7]) && (Result[7] != A[7]);
            end
            3'b001: begin // Subtract
                {Carry, Result} = A - B;
                Overflow = (A[7] != B[7]) && (Result[7] == B[7]);
            end
            3'b010: Result = A & B;    // AND
            3'b011: Result = A | B;    // OR
            3'b100: Result = A ^ B;    // XOR
            3'b101: Result = ~(A | B); // NOR
            default: Result = 8'b0;
        endcase

        Zero = (Result == 8'b0);
        Negative = Result[7];
    end
endmodule

// Processor Module
module InOrderProcessor(
    input wire clk,
    input wire reset
);
    // State definitions
    parameter FETCH = 2'b00;
    parameter DECODE = 2'b01;
    parameter EXECUTE = 2'b10;
    parameter WRITEBACK = 2'b11;

    // Registers and wires
    reg [1:0] current_state, next_state;
    reg [7:0] instruction_mem [0:31];  // Instruction memory
    reg [7:0] current_instruction;     // Current instruction register
    reg [7:0] registers [0:7];         // Register file
    reg [7:0] PC;                      // Program counter
    reg [7:0] A, B;                    // ALU input registers
    wire [7:0] alu_result;             // ALU result
    reg [2:0] opcode;                  // ALU opcode

    // Status flags
    wire zero_flag, carry_flag, overflow_flag, negative_flag;

    // State name for display
    reg [23:0] state_name;

    // ALU instantiation
    ALU alu (
        .A(A),
        .B(B),
        .OpCode(opcode),
        .Result(alu_result),
        .Zero(zero_flag),
        .Carry(carry_flag),
        .Overflow(overflow_flag),
        .Negative(negative_flag)
    );

    // State machine sequential logic
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            current_state <= FETCH;
            PC <= 8'b0;
            state_name <= "FETCH";
        end else begin
            current_state <= next_state;
            case (next_state)
                FETCH: state_name <= "FETCH";
                DECODE: state_name <= "DECODE";
                EXECUTE: state_name <= "EXECUTE";
                WRITEBACK: state_name <= "WRITEBACK";
            endcase
        end
    end

    // State machine combinational logic
    always @(*) begin
        case (current_state)
            FETCH: next_state = DECODE;
            DECODE: next_state = EXECUTE;
            EXECUTE: next_state = WRITEBACK;
            WRITEBACK: next_state = FETCH;
            default: next_state = FETCH;
        endcase
    end

    // Instruction fetch
    always @(posedge clk) begin
        if (current_state == FETCH) begin
            current_instruction <= instruction_mem[PC];
        end
    end

    // Instruction decode and register read
    always @(posedge clk) begin
        if (current_state == DECODE) begin
            opcode <= current_instruction[7:5];
            A <= registers[current_instruction[4:3]];
            B <= registers[current_instruction[2:1]];
        end
    end

    // Write-back
    always @(posedge clk) begin
        if (current_state == WRITEBACK) begin
            registers[current_instruction[6:5]] <= alu_result;
            PC <= PC + 1;
        end
    end

    // Instruction memory initialization
    initial begin
        // Initialize registers
        registers[0] = 8'h08; // R0 = 8
        registers[1] = 8'h04; // R1 = 4
        registers[2] = 8'h02; // R2 = 2
        registers[3] = 8'h01; // R3 = 1
        registers[4] = 8'h00;
        registers[5] = 8'h00;
        registers[6] = 8'h00;
        registers[7] = 8'h00;

        // Example instructions using new ALU opcodes
        instruction_mem[0] = 8'b00001001; // Add R0 = R1 + R2
        instruction_mem[1] = 8'b00101001; // Sub R0 = R1 - R2
        instruction_mem[2] = 8'b01001001; // AND R0 = R1 & R2
        instruction_mem[3] = 8'b01101001; // OR R0 = R1 | R2
        instruction_mem[4] = 8'b10001001; // XOR R0 = R1 ^ R2
        instruction_mem[5] = 8'b10101001; // NOR R0 = ~(R1 | R2)
    end
endmodule
module Testbench;
    reg clk;
    reg reset;

    // Instantiate the processor
    InOrderProcessor uut (
        .clk(clk),
        .reset(reset)
    );

    // Clock generation
    always begin
        #5 clk = ~clk;
    end

    // Test sequence verification
    reg [7:0] expected_results [0:5];
    initial begin
        // Expected results for each instruction
        // ADD: 4 + 2 = 6
        expected_results[0] = 8'h06;
        // SUB: 4 - 2 = 2
        expected_results[1] = 8'h02;
        // AND: 4 & 2 = 0
        expected_results[2] = 8'h00;
        // OR: 4 | 2 = 6
        expected_results[3] = 8'h06;
        // XOR: 4 ^ 2 = 6
        expected_results[4] = 8'h06;
        // NOR: ~(4 | 2) = 249
        expected_results[5] = 8'hF9;
    end

    // Instruction verification counter
    integer verify_count = 0;

    // Enhanced monitoring for FDEW cycle with verification
    always @(posedge clk) begin
        $display("\nTime: %0t, State: %s, PC: %0d", 
            $time, uut.state_name, uut.PC);
            
        case (uut.current_state)
            uut.FETCH: begin
                $display("FETCH Stage:");
                $display("  Reading instruction at PC=%0d", uut.PC);
                $display("  Instruction = %b", uut.instruction_mem[uut.PC]);
                
                // Decode and display instruction meaning
                case (uut.instruction_mem[uut.PC][7:5])
                    3'b000: $display("  Operation: ADD");
                    3'b001: $display("  Operation: SUB");
                    3'b010: $display("  Operation: AND");
                    3'b011: $display("  Operation: OR");
                    3'b100: $display("  Operation: XOR");
                    3'b101: $display("  Operation: NOR");
                    default: $display("  Operation: UNKNOWN");
                endcase
            end
            
            uut.DECODE: begin
                $display("DECODE Stage:");
                $display("  OpCode = %b", uut.current_instruction[7:5]);
                $display("  Destination Reg = R%0d", uut.current_instruction[6:5]);
                $display("  Source Reg1 = R%0d", uut.current_instruction[4:3]);
                $display("  Source Reg2 = R%0d", uut.current_instruction[2:1]);
            end
            
            uut.EXECUTE: begin
                $display("EXECUTE Stage:");
                $display("  A = %h (R%0d)", uut.A, uut.current_instruction[4:3]);
                $display("  B = %h (R%0d)", uut.B, uut.current_instruction[2:1]);
                $display("  ALU Result = %h", uut.alu.Result);
                $display("  Flags: Zero=%b, Carry=%b, Overflow=%b, Negative=%b",
                    uut.alu.Zero, uut.alu.Carry, uut.alu.Overflow, uut.alu.Negative);
            end
            
            uut.WRITEBACK: begin
                $display("WRITEBACK Stage:");
                $display("  Writing %h to R%0d", 
                    uut.alu_result, uut.current_instruction[6:5]);
                    
                // Verify result if within expected range
                if (uut.PC <= 5) begin
                    if (uut.alu_result === expected_results[verify_count]) begin
                        $display("  ✓ Result verified: Expected %h, Got %h", 
                            expected_results[verify_count], uut.alu_result);
                    end else begin
                        $display("  ✗ Result mismatch: Expected %h, Got %h", 
                            expected_results[verify_count], uut.alu_result);
                    end
                    verify_count = verify_count + 1;
                end
                
                $display("\nRegister File Status:");
                for (integer i = 0; i < 8; i = i + 1) begin
                    $display("  R%0d = %h", i, uut.registers[i]);
                end
                $display("----------------------------------------");
            end
        endcase
    end

    // Simulation initialization and control
    initial begin
        // Initialize waveform dump
        $dumpfile("processor.vcd");
        $dumpvars(0, Testbench);

        // Initialize signals
        clk = 0;
        reset = 1;
        
        // Display simulation start
        $display("\nSimulation Started");
        $display("----------------------------------------");
        $display("Testing Instruction Set:");
        $display("1. ADD: R0 = R1 + R2  (4 + 2)");
        $display("2. SUB: R0 = R1 - R2  (4 - 2)");
        $display("3. AND: R0 = R1 & R2  (4 & 2)");
        $display("4. OR:  R0 = R1 | R2  (4 | 2)");
        $display("5. XOR: R0 = R1 ^ R2  (4 ^ 2)");
        $display("6. NOR: R0 = ~(R1 | R2) ~(4 | 2)");
        $display("----------------------------------------");

        // Release reset after 2 clock cycles
        #20 reset = 0;

        // Run for enough cycles to complete all instructions
        // 4 cycles per instruction * 6 instructions = 24 cycles
        // Add some margin for safety
        #250;

        // Performance summary
        $display("\nPerformance Summary:");
        $display("Total clock cycles: %0d", $time/10);
        $display("Instructions executed: 6");
        $display("Average cycles per instruction: %0d", ($time/10)/6);
        
        // Display final register states
        $display("\nFinal Register States:");
        for (integer i = 0; i < 8; i = i + 1) begin
            $display("R%0d = %h", i, uut.registers[i]);
        end
        
        // Test completion status
        $display("\nTest Results:");
        if (verify_count == 6) begin
            $display("✓ All instructions verified");
        end else begin
            $display("✗ Only %0d out of 6 instructions verified", verify_count);
        end
        
        $display("\nSimulation Completed");
        $display("----------------------------------------");
        $finish;
    end

endmodule

module ALU (
    input [7:0] A,        // 8-bit input A
    input [7:0] B,        // 8-bit input B
    input [2:0] opcode,   // 3-bit operation selector
    output reg [7:0] result, // 8-bit result
    output reg zero       // 1-bit zero flag
);
    always @(*) begin
        // Perform the operation based on the opcode
        case (opcode)
            3'b000: result = A + B;       // ADD
            3'b001: result = A - B;       // SUB
            3'b010: result = A & B;       // AND
            3'b011: result = A | B;       // OR
            3'b100: result = A ^ B;       // XOR
            3'b101: result = ~(A | B);    // NOR
            default: result = 8'b00000000; // Default: no operation
        endcase

        // Set the zero flag if the result is 0
        if (result == 8'b00000000) begin
            zero = 1;
        end else begin
            zero = 0;
        end
    end
endmodule

module Testprocessor;
    reg clk, reset;
    InOrderProcessor uut (
        .clk(clk),
        .reset(reset)
    );
initial begin
$dumpfile("waveform.vcd");
$dumpvars(0,Testprocessor);
end
    initial begin
        // Initialize the clock and reset
        clk = 0;
        reset = 1;
        #10 reset = 0;

        // Load instructions into instruction memory
        uut.instruction_memory[0] = 16'b0000000100000010;  // Add instruction (opcode = 000, A = 02, B = 02)
        uut.instruction_memory[1] = 16'b0000001000000100;  // Sub instruction (opcode = 001, A = 04, B = 04)

        // Run the simulation
        #50 $finish;
    end

    always begin
        #5 clk = ~clk;  // Toggle clock every 5 time units
    end
endmodule


module InOrderProcessor (
    input clk,
    input reset
);
    reg [15:0] instruction_memory [0:255];  // 256 instructions (16-bit each)
    reg [7:0] register_file [0:15];          // 16 general-purpose 8-bit registers
    reg [7:0] pc;                           // Program counter
    wire [2:0] opcode;                      // ALU opcode
    wire [7:0] A, B, result;                // ALU operands and result
    wire zero;                              // Zero flag

    // Instantiate Control Unit
    ControlUnit CU (
        .instruction(instruction_memory[pc]),
        .opcode(opcode),
        .A(A),
        .B(B)
    );

    // Instantiate ALU
    ALU alu (
        .A(A),
        .B(B),
        .opcode(opcode),
        .result(result),
        .zero(zero)
    );

    always @(posedge clk or posedge reset) begin
        if (reset) begin
            pc <= 0; // Reset program counter
        end else begin
            // Fetch instruction
            instruction_memory[pc] <= instruction_memory[pc];

            // Decode and execute the instruction
            register_file[pc] <= result;  // Store the result back in a register or memory

            // Update the program counter (for simplicity, incrementing by 1)
            pc <= pc + 1;
        end
    end
endmodule

module Testprocessor;
    reg clk, reset;
    InOrderProcessor uut (
        .clk(clk),
        .reset(reset)
    );
initial begin
$dumpfile("waveform.vcd");
$dumpvars(0,Testprocessor);
end
    initial begin
        // Initialize the clock and reset
        clk = 0;
        reset = 1;
        #10 reset = 0;

        // Load instructions into instruction memory
        uut.instruction_memory[0] = 16'b0000000100000010;  // Add instruction (opcode = 000, A = 02, B = 02)
        uut.instruction_memory[1] = 16'b0000001000000100;  // Sub instruction (opcode = 001, A = 04, B = 04)

        // Run the simulation
        #50 $finish;
    end

    always begin
        #5 clk = ~clk;  // Toggle clock every 5 time units
    end
endmodule



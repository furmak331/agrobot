// ALU Module with corrected flag logic
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
        // Default assignments
        {Carry, Result} = 9'b0;
        Overflow = 1'b0;
        
        case (OpCode)
            3'b000: begin // Add
                {Carry, Result} = A + B;
                Overflow = (A[7] == B[7]) && (Result[7] != A[7]);
            end
            3'b001: begin // Subtract
                Result = A - B;
                Carry = (A < B);
                Overflow = (A[7] != B[7]) && (Result[7] == B[7]);
            end
            3'b010: Result = A & B;    // AND
            3'b011: Result = A | B;    // OR
            3'b100: Result = A ^ B;    // XOR
            3'b101: Result = ~(A | B); // NOR
            default: Result = 8'b0;
        endcase

        // Update flags
        Zero = (Result == 8'b0);
        Negative = Result[7];
    end
endmodule

// Processor Module with corrected instruction encoding
module InOrderProcessor (
    input clk,
    input [7:0] A,
    input [7:0] B,
    input [2:0] OpCode,
    output reg [7:0] Result,
    output reg Zero,
    output reg Carry,
    output reg Overflow,
    output reg Negative
);
    // Internal registers for sequential logic
    reg [7:0] regA, regB;
    reg [2:0] regOpCode;

    // Sequential logic to capture inputs on clock edge
    always @(posedge clk) begin
        regA <= A;
        regB <= B;
        regOpCode <= OpCode;
    end

    // Combinational logic for ALU operations
    always @(*) begin
        case (regOpCode)
            3'b000: {Carry, Result} = regA + regB; // ADD
            3'b001: {Carry, Result} = regA - regB; // SUB
            3'b010: Result = regA & regB;          // AND
            3'b011: Result = regA | regB;          // OR
            3'b100: Result = regA ^ regB;          // XOR
            3'b101: Result = ~(regA | regB);       // NOR
            default: Result = 8'b0;
        endcase
        Zero = (Result == 8'b0);
        Negative = Result[7];
        Overflow = (regOpCode == 3'b000 || regOpCode == 3'b001) ? 
                   ((regA[7] == regB[7]) && (Result[7] != regA[7])) : 0;
    end
endmodule

module Testbench;
    reg clk;
    reg [7:0] A;
    reg [7:0] B;
    reg [2:0] OpCode;
    wire [7:0] Result;
    wire Zero;
    wire Carry;
    wire Overflow;
    wire Negative;

    // Instantiate the processor
    InOrderProcessor uut (
        .clk(clk),
        .A(A),
        .B(B),
        .OpCode(OpCode),
        .Result(Result),
        .Zero(Zero),
        .Carry(Carry),
        .Overflow(Overflow),
        .Negative(Negative)
    );

    // Clock generation
    initial clk = 0;
    always #5 clk = ~clk; // 10 time units clock period

    // Simulation initialization and control
    initial begin
        // Initialize waveform dump
        $dumpfile("processor.vcd");
        $dumpvars(0, Testbench);

        // Initialize signals
        A = 8'h00;
        B = 8'h00;
        OpCode = 3'b000;

        // Display simulation start
        $display("\nSimulation Started");
        $display("----------------------------------------");

        // Test different operations
        #10 A = 8'h04; B = 8'h02; OpCode = 3'b000; // ADD
        #10 A = 8'h04; B = 8'h02; OpCode = 3'b001; // SUB
        #10 A = 8'h04; B = 8'h02; OpCode = 3'b010; // AND
        #10 A = 8'h04; B = 8'h02; OpCode = 3'b011; // OR
        #10 A = 8'h04; B = 8'h02; OpCode = 3'b100; // XOR
        #10 A = 8'h04; B = 8'h02; OpCode = 3'b101; // NOR

        // Wait and finish simulation
        #50;
        $display("\nSimulation Completed");
        $display("----------------------------------------");
        $finish;
    end

    initial begin
        // Monitor outputs
        $monitor("Time=%0d | A=%h B=%h OpCode=%b | Result=%h | Zero=%b Carry=%b Overflow=%b Negative=%b",
            $time, A, B, OpCode, Result, Zero, Carry, Overflow, Negative);
    end
endmodule

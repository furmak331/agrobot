module ALU (
    input [7:0] A,       // 8-bit input A
    input [7:0] B,       // 8-bit input B
    input [2:0] OpCode,  // 3-bit control signal
    output reg [7:0] Result, // 8-bit result
    output reg Zero       // Zero flag (1 if result is 0)
);

    always @(*) begin
        // Perform operation based on OpCode
        case (OpCode)
            3'b000: Result = A + B;            // Add
            3'b001: Result = A - B;            // Subtract
            3'b010: Result = A & B;            // AND
            3'b011: Result = A | B;            // OR
            3'b100: Result = A ^ B;            // XOR
            3'b101: Result = ~(A | B);         // NOR
            default: Result = 8'b00000000;     // Default to 0 (if OpCode is invalid)
        endcase
        
        // Set Zero flag if all bits of Result are 0
        Zero = (Result == 8'b00000000);  // Zero flag will be 1 if Result is zero
    end

endmodule

module ALU_tb;

    // Inputs
    reg [7:0] A;
    reg [7:0] B;
    reg [2:0] OpCode;

    // Outputs
    wire [7:0] Result;
    wire Zero;

    // Instantiate the ALU module
    ALU uut (
        .A(A),
        .B(B),
        .OpCode(OpCode),
        .Result(Result),
        .Zero(Zero)
    );

    // Testbench logic
    initial begin
        // Display header
        $display("Time |   A    |   B    | OpCode | Result | Zero");
        $display("------------------------------------------------------");

        // Test Case 1: Add (A = 8, B = 4)
        A = 8'b00001000; B = 8'b00000100; OpCode = 3'b000; #10;
        $display("%4t | %b | %b |  %b  |  %b   |  %b", $time, A, B, OpCode, Result, Zero);

        // Test Case 2: Subtract (A = 8, B = 4)
        A = 8'b00001000; B = 8'b00000100; OpCode = 3'b001; #10;
        $display("%4t | %b | %b |  %b  |  %b   |  %b", $time, A, B, OpCode, Result, Zero);

        // Test Case 3: AND (A = 8, B = 4)
        A = 8'b00001000; B = 8'b00000100; OpCode = 3'b010; #10;
        $display("%4t | %b | %b |  %b  |  %b   |  %b", $time, A, B, OpCode, Result, Zero);

        // Test Case 4: OR (A = 8, B = 4)
        A = 8'b00001000; B = 8'b00000100; OpCode = 3'b011; #10;
        $display("%4t | %b | %b |  %b  |  %b   |  %b", $time, A, B, OpCode, Result, Zero);

        // Test Case 5: XOR (A = 8, B = 4)
        A = 8'b00001000; B = 8'b00000100; OpCode = 3'b100; #10;
        $display("%4t | %b | %b |  %b  |  %b   |  %b", $time, A, B, OpCode, Result, Zero);

        // Test Case 6: NOR (A = 8, B = 4)
        A = 8'b00001000; B = 8'b00000100; OpCode = 3'b101; #10;
        $display("%4t | %b | %b |  %b  |  %b   |  %b", $time, A, B, OpCode, Result, Zero);

        // Test Case 7: Add (A = 0, B = 0), checking Zero flag
        A = 8'b00000000; B = 8'b00000000; OpCode = 3'b000; #10;
        $display("%4t | %b | %b |  %b  |  %b   |  %b", $time, A, B, OpCode, Result, Zero);

        // End simulation
        $finish;
    end

endmodule


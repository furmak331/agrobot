module divider_4bit(
    input [3:0] A,        // Dividend
    input [3:0] B,        // Divisor
    output [3:0] Quotient,
    output [3:0] Remainder
);
    assign Quotient = A / B;       // Quotient
    assign Remainder = A % B;      // Remainder
endmodule
module divider_4bit_tb;

    // Inputs
    reg [3:0] A;
    reg [3:0] B;

    // Outputs
    wire [3:0] Quotient;
    wire [3:0] Remainder;

    // Instantiate the divider_4bit module (Unit Under Test)
    divider_4bit uut (
        .A(A),
        .B(B),
        .Quotient(Quotient),
        .Remainder(Remainder)
    );

    // Testbench logic
    initial begin
    	        $dumpfile("div.vcd");
     $dumpvars(0, divider_4bit_tb);
        // Display header
        $display("Time |    A   |    B   | Quotient | Remainder");
        $display("---------------------------------------------");

        // Test Case 1: A = 4'b1010 (10), B = 4'b0011 (3), Expected Quotient = 3, Remainder = 1
        A = 4'b1010; B = 4'b0011; #10;
        $display("%4t | %b | %b |   %b    |   %b", $time, A, B, Quotient, Remainder);

        // Test Case 2: A = 4'b1111 (15), B = 4'b0001 (1), Expected Quotient = 15, Remainder = 0
        A = 4'b1111; B = 4'b0001; #10;
        $display("%4t | %b | %b |   %b    |   %b", $time, A, B, Quotient, Remainder);

        // Test Case 3: A = 4'b0101 (5), B = 4'b0010 (2), Expected Quotient = 2, Remainder = 1
        A = 4'b0101; B = 4'b0010; #10;
        $display("%4t | %b | %b |   %b    |   %b", $time, A, B, Quotient, Remainder);

        // Test Case 4: A = 4'b1001 (9), B = 4'b0100 (4), Expected Quotient = 2, Remainder = 1
        A = 4'b1001; B = 4'b0100; #10;
        $display("%4t | %b | %b |   %b    |   %b", $time, A, B, Quotient, Remainder);

        // Test Case 5: A = 4'b0110 (6), B = 4'b0011 (3), Expected Quotient = 2, Remainder = 0
        A = 4'b0110; B = 4'b0011; #10;
        $display("%4t | %b | %b |   %b    |   %b", $time, A, B, Quotient, Remainder);

        // End simulation
        $finish;
    end

endmodule


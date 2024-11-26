module equality_comparator(
    input [3:0] A,  // 4-bit input A
    input [3:0] B,  // 4-bit input B
    output equal    // Output: 1 if A == B, else 0
);
    assign equal = (A == B); // Check if A equals B
endmodule

module equality_comparator_tb;

    // Inputs
    reg [3:0] A;
    reg [3:0] B;

    // Output
    wire equal;

    // Instantiate the equality_comparator module (Unit Under Test)
    equality_comparator uut (
        .A(A),
        .B(B),
        .equal(equal)
    );

    // Testbench logic
    initial begin
        // Display header
        $display("Time |    A   |    B   | Equal");
        $display("-------------------------------");

        // Test Case 1: A = 4'b1010, B = 4'b1010 (Equal)
        A = 4'b1010; B = 4'b1010; #10;
        $display("%4t | %b | %b |   %b", $time, A, B, equal);

        // Test Case 2: A = 4'b1100, B = 4'b1010 (Not Equal)
        A = 4'b1100; B = 4'b1010; #10;
        $display("%4t | %b | %b |   %b", $time, A, B, equal);

    

        // End simulation
        $finish;
    end

endmodule


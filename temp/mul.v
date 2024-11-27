module multiplier_4bit(
    input [3:0] A,
    input [3:0] B,
    output [7:0] Product
);
    assign Product = A * B;
endmodule
module multiplier_4bit_tb;

    // Inputs
    reg [3:0] A;
    reg [3:0] B;

    // Output
    wire [7:0] Product;

    // Instantiate the multiplier_4bit module (Unit Under Test)
    multiplier_4bit uut (
        .A(A),
        .B(B),
        .Product(Product)
    );

    // Testbench logic
    initial begin
 $dumpfile("mul.vcd");
    $dumpvars(0, multiplier_4bit_tb);
        // Display header
        $display("Time |    A   |    B   |   Product");
        $display("------------------------------------");

        // Test Case 1: A = 4'b0010 (2), B = 4'b0011 (3), Expected Product = 6
        A = 4'b0010; B = 4'b0011; #10;
        $display("%4t | %b | %b |   %b", $time, A, B, Product);

        // Test Case 2: A = 4'b1111 (15), B = 4'b0001 (1), Expected Product = 15
        A = 4'b1111; B = 4'b0001; #10;
        $display("%4t | %b | %b |   %b", $time, A, B, Product);


        // Test Case 3: A = 4'b1111 (15), B = 4'b1111 (15), Expected Product = 225
        A = 4'b1111; B = 4'b1111; #10;
        $display("%4t | %b | %b |   %b", $time, A, B, Product);

        // End simulation
        $finish;
    end

endmodule


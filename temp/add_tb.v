module adder_4bit_tb;

    // Inputs
    reg [3:0] A;
    reg [3:0] B;
    reg Cin;

    // Outputs
    wire [3:0] Sum;
    wire Cout;

    // Instantiate the adder_4bit module
    adder_4bit uut (
        .A(A),
        .B(B),
        .Cin(Cin),
        .Sum(Sum),
        .Cout(Cout)
    );

    initial begin
        // Display header
        $display("Time |    A   |    B   | Cin |   Sum  | Cout");
        $display("--------------------------------------------");

        // Test Case 1
        A = 4'b0001; B = 4'b0010; Cin = 0; #10;
        $display("%4t | %b | %b |  %b  | %b |   %b", $time, A, B, Cin, Sum, Cout);

        // Test Case 2
        A = 4'b1111; B = 4'b0001; Cin = 0; #10;
        $display("%4t | %b | %b |  %b  | %b |   %b", $time, A, B, Cin, Sum, Cout);

      

        // Finish simulation
        $finish;
    end

endmodule


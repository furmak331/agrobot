module adder_4bit(
    input [3:0] A,
    input [3:0] B,
    input Cin,        // Carry-in
    output [3:0] Sum,
    output Cout       // Carry-out
);
    assign {Cout, Sum} = A + B + Cin;
endmodule


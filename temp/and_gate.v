// Simple AND Gate Verilog code
module and_gate (
    input wire a,      // First input
    input wire b,      // Second input
    output wire out    // Output of AND operation
);

    // AND gate logic
    assign out = a & b;

endmodule

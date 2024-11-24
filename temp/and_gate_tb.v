// Testbench for AND Gate
module and_gate_tb;

    // Declare testbench signals
    reg a;       // Test input a
    reg b;       // Test input b
    wire out;    // Output wire

    // Instantiate the and_gate module
    and_gate uut (
        .a(a),
        .b(b),
        .out(out)
    );

    // Initial block for stimulus
    initial begin
        // Monitor changes in signals
        $monitor("At time %t, a = %b, b = %b, out = %b", $time, a, b, out);
        
        // Apply test vectors
        a = 0; b = 0; #10;   // Wait for 10 time units
        a = 0; b = 1; #10;
        a = 1; b = 0; #10;
        a = 1; b = 1; #10;
        
        // End simulation after the test
        $finish;
    end

endmodule

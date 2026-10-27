import { describe, expect, it } from "vitest";
import { parseCsv, parseCsvLine, parseCsvWithHeaders } from "@/utils/csv";

describe("CSV parsing", () => {
    it.each([
        ["a,b,c", ["a", "b", "c"]],
        [
            '"Example, Alex","said ""yes""",',
            ["Example, Alex", 'said "yes"', ""],
        ],
        ["  a , , c ", ["a", "", "c"]],
        ["", [""]],
    ])("parses %s", (input, expected) =>
        expect(parseCsvLine(input)).toEqual(expected),
    );
    it("handles CRLF, empty lines, missing fields and extra columns", () => {
        expect(
            parseCsvWithHeaders(
                " name ,dob\r\n\r\nAlex,1990-01-01,extra\r\nSam\r\n",
            ),
        ).toEqual({
            headers: ["name", "dob"],
            rows: [
                { name: "Alex", dob: "1990-01-01" },
                { name: "Sam", dob: "" },
            ],
        });
    });
    it("returns no rows for an empty or header-only file", () => {
        expect(parseCsvWithHeaders(" \n")).toEqual({ headers: [], rows: [] });
        expect(parseCsv("name,dob")).toEqual([]);
    });
});

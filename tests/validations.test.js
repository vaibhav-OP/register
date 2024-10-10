const { validateDomainData, isValidDomain } = require("../utils/validations");
const INVALID_NAMES = require("../utils/invalid-domains.json");

const defaultDomain = {
    name: "aaa",
    record: {
        A: ["121.121.121.121"],
    },
    owner: {
        username: "betsy",
        email: "betsyfuckyoassup@foobar.com",
    },
};

const getstroflen = (len) => Array(len).fill("a").join("");

describe("isValidMX", () => {
    it("should be valid mx record", () => {
        const cases = [
            { mx: "foobar.com", result: true },
            { mx: "as.as", result: true },
            { mx: "ASPMX.L.GOOGLE.COM", result: true },
            { mx: "ALT4.ASPMX.L.GOOGLE.COM", result: true },
            { mx: "hello", result: false },
            { mx: "helalsds-asd5sjdsd.com", result: true },
            { mx: "helalsds?asd5sjdsd.com", result: false },
            { mx: "helalsds_asd5sjdsd.com", result: false },
        ];

        cases.forEach(({ mx, result }) => {
            expect(isValidDomain(mx)).toBe(result);
        });
    });
});

describe("validateDomainData", () => {
    const invalidCases = [
        {},
        { name: "helo" },
        { name: "wwow", record: { A: ["12312"] } },
        ...[
            "",
            " ",
            undefined,
            "hlo wld",
            "g32++13",
            "ajsdD_123yq",
            "khsda%",
            "122*dsd",
            getstroflen(101),
        ].map((name) => ({
            ...defaultDomain,
            name,
        })),
        { ...defaultDomain, record: { CNAME: "sd", A: ["121,3213"] } },
        { ...defaultDomain, record: { A: ["121", "12"], FOOBAR: ["sd"] } },
        { ...defaultDomain, record: { A: [] } },
        { ...defaultDomain, owner: {} },
        { ...defaultDomain, owner: { username: "hwelo" } },
        { ...defaultDomain, owner: { email: "hwelo" } },
        { ...defaultDomain, record: { CNAME: "http://foobar.com" } },
        { ...defaultDomain, record: { CNAME: "https://foobar.com" } },
        { ...defaultDomain, record: { URL: "foobar.com" } },
        {
            ...defaultDomain,
            record: { CNAME: "foobar.com", A: ["11.22.22.33"] },
        },
        {
            ...defaultDomain,
            record: { CNAME: "foobar.com", MX: ["ALT4.ASPMX.L.GOOGLE.COM"] },
        },
        ...INVALID_NAMES.map((name) => ({ ...defaultDomain, name })).slice(
            0,
            1,
        ),
        { ...defaultDomain, name: "ww2.baa" },
        { ...defaultDomain, name: "help.baa" },
        { ...defaultDomain, name: "_github-pages-challenge-is-a-dev" },
        { ...defaultDomain, name: "_github-challenge-is-a-dev" },
        { ...defaultDomain, record: { AAAA: [] } },
        { ...defaultDomain, record: { AAAA: ["182.22.222.22", "::1"] } },
        { ...defaultDomain, record: { AAAA: "182.22.222.22" } },
        { ...defaultDomain, record: { A: "::1" } },
        { ...defaultDomain, name: "_discord" },
        { ...defaultDomain, name: "_gitlab-pages-verification-code" },
        { ...defaultDomain, name: "_acme-challenge" },
        { ...defaultDomain, name: "_dmarc" },
        { ...defaultDomain, name: "_gh-is-a-dev" },
        { ...defaultDomain, name: "_domainkey" },
        { ...defaultDomain, name: "_improvmx" },
        { ...defaultDomain, name: "_vercel" },
    ];

    const validCases = [
        defaultDomain,
        ...[
            "hello",
            "hello-world",
            "11111111111",
            "--wow--",
            "wow--",
            "--wow",
        ].map((name) => ({
            ...defaultDomain,
            name,
        })),
        {
            ...defaultDomain,
            description: getstroflen(99),
        },
        { ...defaultDomain, record: { CNAME: "aa.sd" } },
        { ...defaultDomain, record: { URL: "https://foobar.com" } },
        { ...defaultDomain, record: { URL: "http://foobar.com/foobar/" } },
        { ...defaultDomain, record: { MX: ["ALT4.ASPMX.L.GOOGLE.COM"] } },
        { ...defaultDomain, record: { TXT: "foobar wow nice!!!" } },
        {
            ...defaultDomain,
            record: { A: ["1.1.1.1"], MX: ["mx1.example.com"] },
        },
        { ...defaultDomain, name: "gogo.foo.bar" },
        { ...defaultDomain, name: "ww9.baa" },
        { ...defaultDomain, name: "_github-pages-challenge-phenax.akshay" },
        { ...defaultDomain, name: "_github-pages-challenge-hello01-ga" },
        { ...defaultDomain, name: "_github-pages-challenge-hello01_ga" },
        { ...defaultDomain, name: "_github-challenge-phenax.akshay" },
        { ...defaultDomain, name: "_github-challenge-hello01-ga" },
        { ...defaultDomain, name: "_github-challenge-hello01_ga" },
        {
            ...defaultDomain,
            record: { TXT: ["foobar wow nice!!!", "more text"] },
        },
        {
            ...defaultDomain,
            record: { AAAA: ["::1", "2001:db8:3333:4444:5555:6666:7777:8888"] },
        },
        { ...defaultDomain, record: { A: ["122.222.222.222"] } },
        { ...defaultDomain, name: "_discord.subdomain" },
        { ...defaultDomain, name: "_gitlab-pages-verification-code.subdomain" },
        { ...defaultDomain, name: "_acme-challenge.subdomain" },
        { ...defaultDomain, name: "_dmarc.subdomain" },
        { ...defaultDomain, name: "_gh-phenax.akshay" },
        { ...defaultDomain, name: "_gh-hello01-ga" },
        { ...defaultDomain, name: "_gh-hello01_ga" },
        { ...defaultDomain, name: "_domainkey.subdomain" },
        { ...defaultDomain, name: "mx._domainkey.subdomain" },
        { ...defaultDomain, name: '_improvmx.subdomain' },
        { ...defaultDomain, name: '_vercel.subdomain' },
        { ...defaultDomain, name: "a.b" },
    ];

    it("should return false for invalid data", () => {
        invalidCases.forEach((data) => {
            const { valid, errors } = validateDomainData(data);
            expect(valid).toBe(false);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should return true if the name is valid", () => {
        validCases.forEach((data) => {
            const { valid, errors } = validateDomainData(data);
            if (!valid) console.log(JSON.stringify(errors, null, 2));
            expect(valid).toBe(true);
            expect(errors).toEqual([]);
        });
    });
});

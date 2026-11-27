import { execFileSync } from "node:child_process";
import { lstatSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = join(root, ".ai");
const targets = [join(root, ".agents"), join(root, ".claude")];
const directories = ["agents", "commands", "skills"];

function checkDirectory(path, optional = false) {
    const entry = lstatSync(path, { throwIfNoEntry: false });
    if (!entry && optional) return;
    if (!entry?.isDirectory()) throw new Error(`Expected a directory: ${path}`);
}

checkDirectory(source);
for (const directory of directories) {
    checkDirectory(join(source, directory));
}
for (const target of targets) {
    checkDirectory(target, true);
    for (const directory of directories) {
        checkDirectory(join(target, directory), true);
    }
}

for (const target of targets) {
    mkdirSync(target, { recursive: true });
    for (const directory of directories) {
        const filters = [
            "--exclude=.env*", "--exclude=*.pem", "--exclude=*.key",
            "--exclude=*secret*", "--exclude=*credential*",
        ];
        // Command Markdown files are discovered as slash commands.
        if (directory === "commands") filters.push("--exclude=/README.md");

        execFileSync("rsync", [
            "--recursive", "--checksum", "--delete", ...filters,
            `${join(source, directory)}/`, join(target, directory),
        ], { stdio: "inherit" });
    }
}

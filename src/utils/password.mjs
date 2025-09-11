import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Enter password: ", async (password) => {
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed:", hashed);
  rl.close();
});

const { promisify } = require("util");
const { exec } = require("child_process");
const path = require("path");

// Promisify the exec function
const execAsync = promisify(exec);

// Middleware function to execute the Python script
const executePythonScriptMiddleware = async (req, res, next) => {
  try {
    // Get the absolute path to the Python script
    const pythonScriptPath = path.resolve(__dirname, "app.py");

    // Command to run the Python script
    const pythonCommand = `python ${pythonScriptPath}`;

    // Execute the Python script asynchronously
    const { stdout, stderr } = await execAsync(pythonCommand);

    // Output from the Python script
    console.log(`Python script output: ${stdout}`);

    // Set the Python script output in the request object for further processing
    req.pythonOutput = stdout;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(`Error executing the Python script: ${error}`);
    // Pass the error to the error handling middleware
    next(error);
  }
};

module.exports = { executePythonScriptMiddleware };

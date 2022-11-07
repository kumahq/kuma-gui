import dotenv from 'dotenv'

/**
 * Ensures the tests run with the project’s environment variables being available.
 *
 * It’s important to run the environment variable setup as part of a Jest setup file and before a Jest setup after env file because the latter might statically import a file that makes use of environment variables which wouldn’t be correctly resolved at the time the static imports executed.
 */
dotenv.config()

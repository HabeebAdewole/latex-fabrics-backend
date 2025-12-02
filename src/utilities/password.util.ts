import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

/*
utility class for hashing and comparing passwords using bcrypt
includes methods for:
- hashing a plain text password
- comparing a plain text password with a hashed password
- validating password strength based on defined criteria
*/
export class PasswordUtil {
    private static readonly SALT_ROUNDS =parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

    static async hashPassword(plainPassword: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
            const hashedPassword = await bcrypt.hash(plainPassword, salt);
            return hashedPassword;
        } catch (error: unknown) {
            throw new Error('password hashing failed');
        }
    }

    static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatch;
        } catch (error: unknown) {
            throw new Error('password comparison failed');
        }
    }

    static validatePasswordStrength(password: string): {
        isValid: boolean;
        message: string;
        } {
        if (!password || password.length < 8) {
            return {
                isValid: false,
                message: 'Password must be at least 8 characters long.',
            };
        }

        if (!/[0-9]/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one number',
            };
        }

    // Regular expression to check for at least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one special character',
            };
        }

    // If all checks pass, password is valid
        return {
            isValid: true,
            message: 'Password is strong enough.',
        };
    }
}
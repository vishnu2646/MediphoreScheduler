import { z } from "zod";

export const loanApplicationSchema = z.object({
	firstName: z.string().min(1, "First Name is required").regex(/^[A-Za-z\s]+$/, "First Name must contain only letters"),
	lastName: z.string().min(1, "Last Name is required").regex(/^[A-Za-z\s]+$/, "Last Name must contain only letters"),
	contactNumber: z.string()
		.regex(/^[6-9]\d{9}$/, "Phone number must be a valid Indian mobile number (10 digits starting with 6-9)"),
	email: z.string().email("Invalid email address"),
	travelAgencyName: z.string().min(1, "Travel Agency Name is required"),
	loanAmount: z.preprocess((val) => Number(val),
		z
		.number({ invalid_type_error: "Loan amount must be a number" })
		.min(50000, { message: "Minimum loan amount is ₹50,000" })
		.max(1000000, { message: "Maximum loan amount is ₹1,000,000" })
	),
	termsAccepted: z.literal(true, {
		errorMap: () => ({
			message: "You must accept the terms and conditions",
		}),
	}),
});

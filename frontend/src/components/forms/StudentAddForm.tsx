"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import apiRoutes from "@/lib/routes";
import toast from "react-hot-toast";
import { StudentFormTypes } from "@/types/form-types";
import { useRouter } from "next/navigation";

const studentFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    rollNo: z.string().min(1, "Roll number is required"),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

export function StudentAddForm({
    student,
}: {
    student?: StudentFormTypes | null;
}) {
    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: {
            firstName: student?.user.firstName || "",
            middleName: student?.user.middleName || "",
            lastName: student?.user.lastName || "",
            email: student?.user.email || "",
            rollNo: student?.rollNo || "",
        },
    });

    const router = useRouter();

    async function onSubmit(values: StudentFormValues) {
        try {
            if (student) {
                // update student
                const response = await axios.put(
                    `${apiRoutes.updateStudent}/${student.id}`,
                    {
                        ...values,
                        id: student.id,
                    }
                );
                if (response.status === 200) {
                    toast.success("Student updated successfully");
                    form.reset();
                    router.push("/teacher/students");
                } else {
                    toast.error(
                        response.data.message || "Failed to update student"
                    );
                }
            } else {
                const response = await axios.post(
                    `
                ${apiRoutes.studentRegister}`,
                    {
                        ...values,
                        password: "123456",
                        role: "student",
                    }
                );

                if (response.status === 200) {
                    toast.success("Student added successfully");
                    form.reset();
                    router.push("/teacher/students");
                } else {
                    toast.error(
                        response.data.message || "Failed to add student"
                    );
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to add student");
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-3xl mx-auto p-6"
            >
                <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-center">
                    Student Details
                </h1>

                <p className="text-sm text-muted-foreground text-center">
                    Please provide the student details below.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="First Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Middle Name (optional)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rollNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Roll Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Roll Number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}

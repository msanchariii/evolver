"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubjectFormTypes } from "@/types/form-types";
import axios from "axios";
import apiRoutes from "@/lib/routes";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
});

export function SubjectAddForm({
    subject,
}: {
    subject?: SubjectFormTypes | null;
}) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: subject
            ? {
                name: subject.name,
                description: subject.description,
            }
            : undefined,
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (subject) {
                // Update existing subject
                const res = await axios.put(
                    `${apiRoutes.updateSubject}/${subject.id}`,
                    values
                );
                if (res.status === 200) {
                    console.log("Subject updated successfully");
                    form.reset();
                    router.push("/teacher/subjects");
                } else {
                    console.error("Error updating subject");
                }
                console.log("Updating subject:", subject.id, values);
            } else {
                const response = await axios.post(
                    `${apiRoutes.getSubject}`,
                    values
                );
                console.log("Subject added successfully:", response);
                toast.success("Subject added successfully");
                form.reset();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full max-w-lg mx-auto p-6"
            >
                <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
                    {subject ? "Edit Subject" : "Add Subject"}
                </h1>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter subject name"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Name of the subject to be added.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter description"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A brief description of the subject.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import apiRoutes from "@/lib/routes";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";

const formSchema = z.object({
    subjectId: z.string().min(1, "Subject ID is required"),
    examName: z.string().min(1, "Subject name is required"),
    duration: z.coerce.number().min(1, "Duration is required"),
    noOfQuestions: z.coerce.number().min(1, "Total questions is required"),
});

type Subject = {
    id: string;
    name: string;
    description: string;
    teachers: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        isController: boolean;
    }[];
};

export function ExamAddForm() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const user = useAppStore((state) => state.user);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subjectId: "",
            examName: "",
            duration: 0,
            noOfQuestions: 0,
        },
    });
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(apiRoutes.getSubject);
                setSubjects(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchSubjects();
    }, []);
    // useEffect(() => {
    //     console.log("user", user);
    // }, [user]);
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(user);
            const res = await axios.post(
                apiRoutes.createExam,
                {
                    ...values,
                    totalMarks: values.noOfQuestions,
                    addedBy: user?.userId,
                },
                { withCredentials: true }
            );

            if (res.status === 201) {
                const examId = res.data.data.id;
                toast.success("Exam created successfully");
                form.reset();
                router.push(`/teacher/exams/add/${examId}`);
            }
        } catch (error: any) {
            toast.error("Error creating exam");
            console.error("Error creating exam:", error);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full max-w-xl mx-auto p-6"
            >
                <h1 className="text-3xl font-semibold text-center border-b pb-4">
                    Create Exam
                </h1>
                {/* Subject Select */}
                {subjects && subjects.length > 0 && (
                    <FormField
                        control={form.control}
                        name="subjectId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        // value={field.value}
                                    ><FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem
                                                    key={subject.id}
                                                    value={subject.id}
                                                >
                                                    {subject.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                            
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Exam Name Input */}
                <FormField
                    control={form.control}
                    name="examName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Exam Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter exam name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Duration Input */}
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration (in minutes)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter duration"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Total Questions Input */}
                <FormField
                    control={form.control}
                    name="noOfQuestions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Questions</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter total questions"
                                    {...field}
                                />
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

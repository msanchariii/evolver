import db from "../db/db.js";

export const getUserName = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("userId", userId);

        const user = await db.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const fullName = `${user.firstName} ${
            user.middleName ? user.middleName + " " : ""
        }${user.lastName}`;
        return res.status(200).json({
            message: "User name retrieved successfully",
            data: {
                fullName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error retrieving user name:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getStudentData = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await db.student.findUnique({
            where: { id: parseInt(studentId) },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        middleName: true,
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Student data retrieved successfully",
            data: student,
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const getAllStudent = async (req, res) => {
    try {
        const students = await db.student.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        return res.status(200).json({
            message: "All students retrieved successfully",
            data: students,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getAllTeacher = async (req, res) => {
    try {
        const teachers = await db.teacher.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                    },
                },
                subjects: {
                    include: {
                        subject: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return res.status(200).json({
            message: "All teachers retrieved successfully",
            data: teachers,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getTeacherData = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await db.teacher.findUnique({
            where: { id: parseInt(teacherId) },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        middleName: true,
                    },
                },
                subjects: {
                    include: {
                        subject: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Teacher data retrieved successfully",
            data: teacher,
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const editStudentById = async (req, res) => {
    try {
        const { id, email, password, firstName, lastName, middleName, rollNo } =
            req.body;

        if (!id) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        // const hasUserFields =
        //     email || password || firstName || lastName || middleName;
        const userUpdateData = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(email && { email }),
            ...(password && { password }),
            middleName,
        };

        const user = await db.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let updatedStudent;
        const updatedUser = await db.user.update({
            where: { id },
            data: userUpdateData,
        });

        if (rollNo) {
            const student = await db.student.findUnique({ where: { id } });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            updatedStudent = await db.student.update({
                where: { id },
                data: { rollNo },
            });
        }

        if (!updatedUser && !updatedStudent) {
            return res.status(400).json({
                message: "No valid fields provided to update",
            });
        }

        return res.status(200).json({
            message: "Update successful",
            data: {
                ...(updatedUser && { user: updatedUser }),
                ...(updatedStudent && { student: updatedStudent }),
            },
        });
    } catch (error) {
        console.error("Error updating student:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const editTeacherById = async (req, res) => {
    try {
        const {
            id,
            email,
            password,
            firstName,
            lastName,
            middleName,
            subjects,
            isController,
            role,
        } = req.body;

        console.log("req.body", req.body);

        if (!id) {
            return res.status(400).json({ message: "Teacher ID is required" });
        }

        const userUpdateData = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(email && { email }),
            ...(password && { password }),
            role,
            middleName,
        };

        const user = await db.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await db.user.update({
            where: { id },
            data: userUpdateData,
        });

        if (!updatedUser) {
            return res.status(400).json({
                message: "No valid fields provided to update",
            });
        }
        if (isController) {
            const teacher = await db.teacher.findUnique({ where: { id } });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            const updatedTeacher = await db.teacher.update({
                where: { id },
                data: { isController },
            });
        }
        if (subjects) {
            const teacher = await db.teacher.findUnique({ where: { id } });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            const updatedTeacher = await db.teacher.update({
                where: { id },
                data: { subjects },
            });
        }

        return res.status(200).json({
            message: "Update successful",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating teacher:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

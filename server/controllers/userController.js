import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// ✅ Create User
export const createUser = asyncHandler(async (req, res) => {
    console.log("Creating a user");

    const { email } = req.body;

    const userExists = await prisma.user.findUnique({
        where: { email }
    });

    if (!userExists) {
        const user = await prisma.user.create({ data: req.body });
        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } else {
        return res.status(400).json({ message: "User already exists" });
    }
});

// ✅ Book a Visit
export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;  // Residency ID

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const visits = user.bookedVisits || [];

        if (visits.some(visit => visit.residencyId === id)) {
            return res.status(400).json({ message: "You have already booked this visit" });
        }

        // ✅ Update user with new visit
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                bookedVisits: {
                    set: [...visits, { residencyId: id, date: new Date(date) }]
                }
            }
        });

        return res.status(201).json({ message: "Visit booked successfully", user: updatedUser });
    } catch (err) {
        console.error("Error booking visit:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Get all Bookings
export const getAllBookings = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try { 
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        });

        if (!user || !user.bookedVisits || user.bookedVisits.length === 0) {
            return res.status(404).json({ message: "No bookings found" });
        }

        return res.status(200).json({ bookedVisits: user.bookedVisits });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Cancel Booking
export const cancelBooking = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;  // Residency ID

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        });

        if (!user || !user.bookedVisits) {
            return res.status(404).json({ message: "User or bookings not found" });
        }

        const updatedVisits = user.bookedVisits.filter((visit) => visit.residencyId !== id);

        if (updatedVisits.length === user.bookedVisits.length) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await prisma.user.update({
            where: { email },
            data: { bookedVisits: { set: updatedVisits } }
        });

        return res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Add/Remove Residency from Favorites
export const toFav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;  // Residency ID

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const favResidenciesID = user.favResidenciesID || [];

        if (favResidenciesID.includes(id)) {
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: { set: favResidenciesID.filter(favId => favId !== id) }
                }
            });
            return res.json({ message: "Residency removed from favorites", user: updatedUser });
        } else {
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: { set: [...favResidenciesID, id] }
                }
            });
            return res.json({ message: "Residency added to favorites", user: updatedUser });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Get all favorite residencies
export const getAllFav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { favResidenciesID: true },
        });

        if (!user || !user.favResidenciesID || user.favResidenciesID.length === 0) {
            return res.status(404).json({ message: "No favorite residencies found" });
        }

        return res.status(200).json({ favResidencies: user.favResidenciesID });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

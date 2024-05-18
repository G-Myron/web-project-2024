import express from 'express'
import { ReservationController } from "../controllers/reservationController.js"

const router = express.Router()


router.get("/edit", (req, res) => {
    res.render("user/edit", {edit: 1})
})

router.get("/my_reservations", async (req, res) => {
    const resvs = await ReservationController.getReservationsByUser(req.session.username)

    console.log(resvs);
    
    res.render("user/reservations", {reserv: 1, reservations: resvs})
})


export {router}

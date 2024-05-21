import express from 'express'
import { DetailsController } from "../controllers/detailsController.js"
import { RatingController } from '../controllers/ratingController.js'

const router = express.Router()

router.get("/:category", async (req, res, next) => {
  // Validation
  try {
    const acceptableCategories = (await DetailsController.getAcceptableCategories()).map( cat => cat.name)
    if (! acceptableCategories.includes(req.params.category)){
        res.status(400)
        throw new Error("Invalid vehicle category.")
    }
  }
  catch(err) { next(err) }
  
  const daysCount = DetailsController.getDays( req.query.from, req.query.to )
  const category = await DetailsController.getCategoryDetails( req.params.category, daysCount )
  const ratings = await RatingController.getRatings(category.name, req.query.city)

  res.render("vehicleDetails", {
    city: req.query.city,
    dateFrom: req.query.from,
    dateTo: req.query.to,
    category: category,
    days: daysCount,
    ratings: ratings
  })

})



export {router}
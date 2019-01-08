const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Advertisement model
const Advertisement = require("../../models/Advertisement");

// Validation
const validateAdvertisementInput = require("../../validations/advertisement");

// @route   GET api/advertisements
// @desc    Get advertisements
// @access  Public
router.get("/", (req, res) => {
  Advertisement.find()
    .populate("user")
    .populate("applicants.user")
    .sort({ date: -1 })
    .then(ads => res.json(ads))
    .catch(err =>
      res.status(404).json({ noadvertisementsfound: "No advertisements found" })
    );
});

// @route   GET api/advertisements/:id
// @desc    Get Advertisement by id
// @access  Public
router.get("/:id", (req, res) => {
  Advertisement.findById(req.params.id)
    .populate("user")
    .populate("applicants.user")
    .then(adv => {
      if (adv) {
        res.json(adv);
      } else {
        res
          .status(404)
          .json({ noadvfound: "No Advertisement found with that ID" });
      }
    })
    .catch(err =>
      res
        .status(404)
        .json({ noadvfound: "No Advertisement found with that ID" })
    );
});

// @route   POST /api/advertisements
// @desc    Create advertisement
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAdvertisementInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newAdv = new Advertisement({
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    });

    newAdv.save().then(adv => res.json(adv));
  }
);

// @route   PUT api/advertisements/:id
// @desc    Edit advertisement
// @access  Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAdvertisementInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    const advFields = {};

    if (req.body.title) advFields.title = req.body.title;
    if (req.body.details) advFields.details = req.body.details;
    if (req.body.status) advFields.status = req.body.status;

    Advertisement.findOneAndUpdate(
      { user: req.user.id },
      { $set: advFields },
      { new: true }
    ).then(adv => res.json(adv));
  }
);

// @route   DELETE api/advertisements/:id
// @desc    Delete advertisment
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Advertisement.find({ user: req.user.id })
      .deleteOne({
        _id: req.params.id
      })
      .then(() => res.json({ success: "Succesfully Deleted" }))
      .catch(err =>
        res
          .status(404)
          .json({ unabletodelete: "deleting the data not successfully" })
      );
  }
);

// @route   PUT api/advertisements/:id
// @desc    submit application in current advertisement based on the params id
// @access  Private
router.put(
  "/apply/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Advertisement.findOne({ _id: req.params.id }).then(ads => {
      const newApplicant = {
        user: req.user.id,
        message: req.body.message
      };
      ads.applicants.unshift(newApplicant);
      ads.save().then(ads => res.json(ads));
    });
  }
);

module.exports = router;

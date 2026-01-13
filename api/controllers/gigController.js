import Gig from "../models/Gig.js";

const createGig = async (req, res) => {
  // console.log(req.user);
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Please provide data to create new gig" });
  }
  const { title, description, budget } = req.body;
  if (!title || !description || !budget) {
    return res
      .status(400)
      .json({ message: "Please provide all require field" });
  }
  try {
    const gig = new Gig({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    const createdGig = await gig.save();
    res.status(201).json(createdGig);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getGigs = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const gigs = await Gig.find({ ...keyword, status: "open" }).populate(
      "ownerId",
      "name"
    );
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { createGig, getGigs };

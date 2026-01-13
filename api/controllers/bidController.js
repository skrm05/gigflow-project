import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

const placeBid = async (req, res) => {
  const { gigId, message, price } = req.body;

  try {
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });

    if (existingBid) {
      return res
        .status(400)
        .json({ message: "You have already placed a bid on this gig" });
    }
    const bid = new Bid({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    const savedBid = await bid.save();
    await savedBid.populate("freelancerId", "name email");
    const io = req.app.get("io");
    io.emit("new-bid", savedBid);

    res.status(201).json(savedBid);
  } catch (error) {
    res.status(500).json({ message: "Failed to place bid" });
  }
};

const getBidsForGig = async (req, res) => {
  try {
    const bids = await Bid.find({ gigId: req.params.gigId }).populate(
      "freelancerId",
      "name email"
    );
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bids" });
  }
};

const hireFreelancer = async (req, res) => {
  const { bidId } = req.params;

  try {
    const bidToHire = await Bid.findById(bidId).populate("freelancerId");
    if (!bidToHire) {
      return res.status(404).json({ message: "Bid not found" });
    }
    const gig = await Gig.findById(bidToHire.gigId);
    if (gig.status === "assigned") {
      return res
        .status(400)
        .json({ message: "This gig is already assigned to someone else!" });
    }
    bidToHire.status = "hired";
    await bidToHire.save();

    gig.status = "assigned";
    await gig.save();
    await Bid.updateMany(
      { gigId: bidToHire.gigId, _id: { $ne: bidId } },
      { $set: { status: "rejected" } }
    );
    const io = req.app.get("io");
    io.emit("hired-notification", {
      freelancerId: bidToHire.freelancerId._id,
      gigTitle: gig.title,
      message: `🎉 You have been hired for ${gig.title}!`,
    });

    res.json({ message: "Freelancer hired successfully" });
  } catch (error) {
    res.status(500).json({ message: "Hiring failed" });
  }
};

export { placeBid, getBidsForGig, hireFreelancer };

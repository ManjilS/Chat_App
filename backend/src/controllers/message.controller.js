import Message from '../models/Message.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    }catch (err) {
        console.log("Error in getAllContacts controller :", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessagesByUserId = async (req, res) => {
    try{
        const myId = req.user._id;
        const {id:userToChatId }= req.params;
        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        });
        res.status(200).json(messages);
    }catch{
        console.log("Error in getMessagesByUserId controller :",err);
        res.status(500).json({message:"Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    
    
    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newMessage", newMessage);
    // }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });
        const chatPartnersIds = [
            ...new Set (
                messages.map((msg) => 
                msg.senderId.toString() === loggedInUserId.toString() 
                ? msg.receiverId.toString() 
                : msg.senderId.toString())
            ),
        ];
        const chatPartners = await User.find({_id: {$in: chatPartnersIds}}).select("-password");
        res.status(200).json(chatPartners);
    }catch(err){
        console.log("Error in getChatPartners controller :",err);
        res.status(500).json({message:"Internal Server Error" });
    }
};
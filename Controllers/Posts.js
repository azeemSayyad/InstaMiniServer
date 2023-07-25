import Post from "../Modals/Posts.js";
import User from "../Modals/User.js";

export const createPosts = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    let user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      description: description,
      picturePath,
      userPicturePath: user.picturePath,
      location: user.location,
      likes: {},
      comments: [],
    });
    await newPost.save();
    let posts = await Post.find();
    res.status(201).json(posts);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getPostsFeed = async (req, res) => {
  try {
    let posts = await Post.find();
    console.log("posts 30", posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getUserFeed = async (req, res) => {
  try {
    let { userId } = req.params;
    let posts = await Post.find({ userId: userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    console.log(isLiked);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    let { comment, commentedUserId } = req.body;
    let { postId } = req.params;

    const {comments} = await Post.findById(postId);
    const { firstName, picturePath } = await User.findById(commentedUserId);
    console.log("78")

    let val = {
      comment,
      name: firstName,
      picturePath,
      commentedUserId,
    };
    comments.push(val);
    console.log("87")
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { comments: comments },
      { new: true }
    );
    console.log("92")

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const deletePost = async (req, res) => {
  try {
    let { postId } = req.params;
    await Post.findByIdAndDelete(postId);

    let posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

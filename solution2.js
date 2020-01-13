const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://dino:gary@cluster0-c4ci4.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error('NOT connected -- Something Wrong', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String, 
  tags: [ String ],
  date: Date, 
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    return await Course
        .find({isPublished: true, tags: { $in: ['frontend', 'backend']}})
        .sort({price: -1})
        .select({name: 1, author: 1})
}

async function run() {
    let courses = await getCourses()
    console.log(courses)
}

run()
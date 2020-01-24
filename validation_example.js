const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://dino:gary@cluster0-c4ci4.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error('NOT connected -- Something Wrong', err));

const courseSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true,
      minlength: 5,
      maxlength: 255 
      },
    category: {
        type: String,
        required: true,
        enum: ['web','mobile','network'],
        lowercase: true,
        trim: true
    },
    author: String, 
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback) {
                setTimeout(() => {
                    const result = v && v.length > 0;
                    callback(result);
                }, 4000);
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: {type: Date, default: Date.now }, 
    isPublished: Boolean,
    price: {
      type: Number,
      required: function() {return this.isPublished},
      min: 10,
      max: 200,
      get: v => Math.round(v),
      set: v => Math.round(v)
  }
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    const pageNumber = 2;
    const pageSize = 10;


    const courses = await Course
        .find({_id: '5e1dfbd9c6600719a719283e'})
            .sort({ name: 1 })
            .select({ price: 1})

        console.log(courses[0].price)
   
}

async function createCourse() {
    const course = new Course({
        name: 'asdfasdf',
        category: 'Web',
        author: 'Hey Fro',
        tags: ['angular', 'bremhof'],
        isPublished: true,
        price: 16.8
    });

    try {
        const result = await course.save()
        console.log(result);
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message);
    }
}

async function updateCourse(id) {
    try {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: false
        }
    }, { new: true });

    console.log(course);

    } catch(err) {
        console.log(err);
    }
}

async function removeCourse(id) {
  // const result = await Course.deleteMany({ _id: id });
   const course = await Course.findByIdAndRemove(id);
   console.log(course);
}

getCourses()
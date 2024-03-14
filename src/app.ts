import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Todo from './models/todo';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all Todos
app.get('/todos', async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Create a Todo
app.post('/todos', async (req: Request, res: Response) => {
    const { title } = req.body;
    const todo = new Todo({
        title,
        completed: false
    });
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Update a Todo (mark as completed or incomplete)
app.put('/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
        res.json(updatedTodo);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a Todo
app.delete('/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error: any) => {
        console.error('Error connecting to MongoDB:', error);
    });


// Serve the index.html file
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
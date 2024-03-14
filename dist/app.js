"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const todo_1 = __importDefault(require("./models/todo"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Get all Todos
app.get('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield todo_1.default.find();
        res.json(todos);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Create a Todo
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const todo = new todo_1.default({
        title,
        completed: false
    });
    try {
        const newTodo = yield todo.save();
        res.status(201).json(newTodo);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Update a Todo (mark as completed or incomplete)
app.put('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const updatedTodo = yield todo_1.default.findByIdAndUpdate(id, { completed }, { new: true });
        res.json(updatedTodo);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Delete a Todo
app.delete('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield todo_1.default.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
// Connect to MongoDB
mongoose_1.default.connect('mongodb://localhost:27017/todo')
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});

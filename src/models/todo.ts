import { Schema, model, Document } from 'mongoose';

interface ITodo extends Document {
    title: string;
    completed: boolean;
}

const TodoSchema = new Schema<ITodo>({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

export default model<ITodo>('Todo', TodoSchema);

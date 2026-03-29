import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: varchar('name', { length: 255 }),
  notes: text('notes'),
  performedAt: timestamp('performed_at').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  muscleGroup: varchar('muscle_group', { length: 100 }),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id')
    .notNull()
    .references(() => exercises.id),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workoutExerciseId: integer('workout_exercise_id')
    .notNull()
    .references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps'),
  weightLbs: numeric('weight_lbs', { precision: 6, scale: 2 }),
  durationSeconds: integer('duration_seconds'),
  notes: text('notes'),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

// Relations (for Drizzle query API)

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(sets),
  })
);

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

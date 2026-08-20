import type { Exercise } from '../types';

export const exercises: Exercise[] = [
  // Chest
  {
    id: '1',
    name: 'Barbell Bench Press',
    description: 'The king of chest exercises. Lie on a bench and press the barbell from chest to full extension.',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    type: 'compound',
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on a bench with your eyes under the bar',
      'Grip the bar with hands slightly wider than shoulder-width',
      'Plant feet firmly on the floor',
      'Lower the bar to mid-chest with control',
      'Press the bar back up to starting position'
    ],
    tips: [
      'Keep your core tight throughout the movement',
      'Don\'t bounce the bar off your chest',
      'Keep your wrists straight and in line with your forearms'
    ]
  },
  {
    id: '2',
    name: 'Incline Dumbbell Press',
    description: 'Targets the upper chest and front deltoids using dumbbells on an inclined bench.',
    muscleGroups: ['chest', 'shoulders'],
    type: 'compound',
    equipment: ['dumbbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Set the bench to 30-45 degree incline',
      'Hold dumbbells at shoulder height with palms facing forward',
      'Press the dumbbells up until arms are fully extended',
      'Lower with control back to starting position'
    ],
    tips: [
      'Keep the incline moderate (30-45 degrees) for optimal upper chest activation',
      'Don\'t let the dumbbells drift too wide'
    ]
  },
  {
    id: '3',
    name: 'Dumbbell Flyes',
    description: 'Isolation exercise for chest that stretches the pectoral muscles.',
    muscleGroups: ['chest'],
    type: 'isolation',
    equipment: ['dumbbell', 'bench'],
    difficulty: 'beginner',
    instructions: [
      'Lie flat on a bench holding dumbbells above chest',
      'Keep slight bend in elbows throughout',
      'Lower arms out to sides in wide arc',
      'Feel stretch in chest, then bring dumbbells back up'
    ],
    tips: [
      'Don\'t go too heavy - focus on the stretch',
      'Keep elbows slightly bent to protect joints'
    ]
  },
  {
    id: '4',
    name: 'Push-Ups',
    description: 'Classic bodyweight exercise for chest, shoulders, and triceps.',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    type: 'compound',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Keep body in straight line from head to heels',
      'Lower chest to floor by bending elbows',
      'Push back up to starting position'
    ],
    tips: [
      'Don\'t let hips sag or pike up',
      'Full range of motion: chest nearly touches floor'
    ]
  },
  // Back
  {
    id: '5',
    name: 'Deadlift',
    description: 'The ultimate full-body compound movement. Lifts barbell from floor to hip level.',
    muscleGroups: ['back', 'hamstrings', 'glutes', 'traps'],
    type: 'compound',
    equipment: ['barbell'],
    difficulty: 'advanced',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees to grip the bar',
      'Keep back flat, chest up, shoulders slightly in front of bar',
      'Drive through heels, extend hips and knees simultaneously',
      'Stand tall with shoulders back, then lower with control'
    ],
    tips: [
      'Keep the bar close to your body throughout',
      'Don\'t round your lower back',
      'Push the floor away rather than pulling the bar up'
    ]
  },
  {
    id: '6',
    name: 'Pull-Ups',
    description: 'Bodyweight back exercise. Pull body up until chin clears the bar.',
    muscleGroups: ['back', 'biceps', 'lats'],
    type: 'compound',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'Hang from pull-up bar with palms facing away, hands shoulder-width apart',
      'Engage core and pull shoulder blades down and back',
      'Pull body up until chin clears the bar',
      'Lower with control to full arm extension'
    ],
    tips: [
      'Initiate the movement by pulling with your lats, not arms',
      'Don\'t swing or use momentum (kipping)',
      'Full range of motion: dead hang to chin over bar'
    ]
  },
  {
    id: '7',
    name: 'Bent-Over Barbell Row',
    description: 'Row barbell to lower chest/upper abdomen while hinged at hips.',
    muscleGroups: ['back', 'biceps', 'lats'],
    type: 'compound',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet shoulder-width apart, grip barbell with palms down',
      'Hinge at hips until torso is at 45-degree angle, back flat',
      'Pull barbell to lower chest/upper abdomen',
      'Squeeze shoulder blades together at top',
      'Lower with control to full arm extension'
    ],
    tips: [
      'Keep elbows close to body',
      'Don\'t round your lower back',
      'Pull with your back, not your arms'
    ]
  },
  {
    id: '8',
    name: 'Lat Pulldown',
    description: 'Cable exercise pulling bar down to upper chest.',
    muscleGroups: ['back', 'lats', 'biceps'],
    type: 'compound',
    equipment: ['cable', 'machine'],
    difficulty: 'beginner',
    instructions: [
      'Sit at lat pulldown machine with thighs secured under pads',
      'Grip bar with hands wider than shoulder-width, palms facing forward',
      'Lean back slightly, pull bar down to upper chest',
      'Squeeze shoulder blades together at bottom',
      'Allow bar to rise with control to starting position'
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Pull with your lats, not your arms',
      'Full range of motion: arms fully extended at top'
    ]
  },
  // Legs
  {
    id: '9',
    name: 'Barbell Squat',
    description: 'The king of leg exercises. Squat down with barbell on back, then stand up.',
    muscleGroups: ['legs', 'quadriceps', 'glutes', 'hamstrings'],
    type: 'compound',
    equipment: ['barbell', 'rack'],
    difficulty: 'intermediate',
    instructions: [
      'Position bar on upper back/traps, not neck',
      'Stand with feet shoulder-width apart, toes slightly outward',
      'Brace core, keep chest up, neutral spine',
      'Break at hips and knees simultaneously',
      'Descend until thighs are at least parallel to floor',
      'Drive through heels, extend hips and knees to stand'
    ],
    tips: [
      'Keep knees tracking in line with toes',
      'Don\'t round your lower back',
      'Maintain tight core throughout movement'
    ]
  },
  {
    id: '10',
    name: 'Romanian Deadlift',
    description: 'Hip hinge movement targeting hamstrings and glutes.',
    muscleGroups: ['hamstrings', 'glutes', 'back'],
    type: 'compound',
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet hip-width apart, grip bar with palms down',
      'Keep knees slightly bent, back flat, shoulders back',
      'Push hips back while lowering bar along thighs',
      'Lower until you feel stretch in hamstrings (usually mid-shin)',
      'Drive hips forward, squeeze glutes at top'
    ],
    tips: [
      'Keep bar close to body throughout',
      'Don\'t round your back',
      'Feel the stretch in your hamstrings, not lower back'
    ]
  },
  {
    id: '11',
    name: 'Leg Press',
    description: 'Machine exercise pushing weight away with legs.',
    muscleGroups: ['legs', 'quadriceps', 'glutes'],
    type: 'compound',
    equipment: ['machine'],
    difficulty: 'beginner',
    instructions: [
      'Sit in leg press machine with back flat against pad',
      'Place feet shoulder-width apart on platform',
      'Release safety locks',
      'Lower platform by bending knees toward chest',
      'Press platform away by extending legs',
      'Do not lock knees at top'
    ],
    tips: [
      'Keep lower back pressed into pad',
      'Don\'t let knees cave inward',
      'Full range of motion without rounding lower back'
    ]
  },
  {
    id: '12',
    name: 'Walking Lunges',
    description: 'Dynamic leg exercise stepping forward into lunge position.',
    muscleGroups: ['legs', 'quadriceps', 'glutes'],
    type: 'compound',
    equipment: ['bodyweight', 'dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Stand tall with feet together, dumbbells at sides (optional)',
      'Step forward with right foot into lunge position',
      'Lower until both knees form 90-degree angles',
      'Push through front foot to bring left foot forward',
      'Continue alternating legs as you move forward'
    ],
    tips: [
      'Keep torso upright, core engaged',
      'Front knee should not extend past toe',
      'Take long enough steps for proper depth'
    ]
  },
  // Shoulders
  {
    id: '13',
    name: 'Overhead Press',
    description: 'Standing barbell press from shoulders to overhead.',
    muscleGroups: ['shoulders', 'triceps'],
    type: 'compound',
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold bar at shoulder height with grip slightly wider than shoulders',
      'Brace core, squeeze glutes',
      'Press bar straight up until arms are fully extended',
      'Lower bar with control back to shoulders'
    ],
    tips: [
      'Keep core tight to avoid arching lower back',
      'Don\'t use leg drive (that\'s a push press)',
      'Bar path should be straight up and down'
    ]
  },
  {
    id: '14',
    name: 'Lateral Raises',
    description: 'Isolation exercise for side deltoids.',
    muscleGroups: ['shoulders'],
    type: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart, dumbbells at sides',
      'Keep slight bend in elbows throughout',
      'Raise arms out to sides until parallel to floor',
      'Pause briefly at top',
      'Lower with control to starting position'
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Lead with elbows, not hands',
      'Use lighter weight for proper form'
    ]
  },
  // Arms
  {
    id: '15',
    name: 'Barbell Curls',
    description: 'Classic bicep exercise using barbell.',
    muscleGroups: ['biceps'],
    type: 'isolation',
    equipment: ['barbell'],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold barbell with palms facing forward, hands shoulder-width apart',
      'Keep elbows close to torso throughout',
      'Curl bar up toward shoulders by flexing biceps',
      'Squeeze at top, then lower with control'
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Keep elbows stationary at sides',
      'Full range of motion: arms fully extended at bottom'
    ]
  },
  {
    id: '16',
    name: 'Tricep Rope Pushdowns',
    description: 'Cable exercise targeting triceps.',
    muscleGroups: ['triceps'],
    type: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    instructions: [
      'Attach rope to high pulley of cable machine',
      'Stand with feet shoulder-width apart, slight bend in knees',
      'Grip rope with palms facing each other',
      'Keep elbows tucked at sides',
      'Push rope down by extending arms fully',
      'Separate ends of rope at bottom, squeeze triceps'
    ],
    tips: [
      'Keep upper arms stationary throughout',
      'Don\'t lean forward or use body weight',
      'Full extension at bottom for maximum contraction'
    ]
  },
  // Core
  {
    id: '17',
    name: 'Plank',
    description: 'Isometric core exercise maintaining straight body position.',
    muscleGroups: ['abs'],
    type: 'bodyweight',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in push-up position',
      'Lower onto forearms, elbows under shoulders',
      'Keep body in straight line from head to heels',
      'Engage core and glutes',
      'Hold position for desired time'
    ],
    tips: [
      'Don\'t let hips sag or pike up',
      'Breathe normally throughout',
      'Squeeze glutes to help maintain position'
    ]
  },
  {
    id: '18',
    name: 'Hanging Leg Raises',
    description: 'Advanced core exercise raising legs while hanging.',
    muscleGroups: ['abs'],
    type: 'bodyweight',
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    instructions: [
      'Hang from pull-up bar with arms fully extended',
      'Keep legs straight and together',
      'Use core to raise legs until parallel to floor (or higher)',
      'Lower with control to starting position'
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Initiate movement from core, not hips',
      'Control the descent - don\'t drop legs'
    ]
  },
  // Cardio
  {
    id: '19',
    name: 'Running',
    description: 'Fundamental cardiovascular exercise.',
    muscleGroups: ['legs'],
    type: 'cardio',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start with proper warm-up',
      'Maintain upright posture with slight forward lean',
      'Land on midfoot, roll through to toes',
      'Keep cadence around 170-180 steps per minute',
      'Breathe rhythmically'
    ],
    tips: [
      'Don\'t overstride - land under your center of mass',
      'Keep shoulders relaxed, arms swinging naturally',
      'Start slow and build up gradually'
    ]
  },
  {
    id: '20',
    name: 'Jump Rope',
    description: 'High-intensity cardio exercise using jump rope.',
    muscleGroups: ['legs', 'calves'],
    type: 'cardio',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Hold rope handles at hip height, elbows close to body',
      'Rotate wrists to swing rope over head',
      'Jump with both feet as rope approaches',
      'Land softly on balls of feet',
      'Maintain steady rhythm'
    ],
    tips: [
      'Jump just high enough to clear rope (1-2 inches)',
      'Keep elbows in, rotate from wrists not arms',
      'Start with basic bounce, progress to variations'
    ]
  }
];

// Add more exercises to reach 100+
export const additionalExercises: Partial<Exercise>[] = [
  { id: '21', name: 'Incline Bench Press', muscleGroups: ['chest', 'shoulders'], type: 'compound', equipment: ['barbell', 'bench'], difficulty: 'intermediate' },
  { id: '22', name: 'Decline Bench Press', muscleGroups: ['chest'], type: 'compound', equipment: ['barbell', 'bench'], difficulty: 'intermediate' },
  { id: '23', name: 'Cable Crossovers', muscleGroups: ['chest'], type: 'isolation', equipment: ['cable'], difficulty: 'beginner' },
  { id: '24', name: 'Chest Press Machine', muscleGroups: ['chest'], type: 'compound', equipment: ['machine'], difficulty: 'beginner' },
  { id: '25', name: 'Svend Press', muscleGroups: ['chest'], type: 'isolation', equipment: ['dumbbell'], difficulty: 'beginner' },
  
  // More Back
  { id: '26', name: 'T-Bar Row', muscleGroups: ['back', 'lats'], type: 'compound', equipment: ['barbell', 'machine'], difficulty: 'intermediate' },
  { id: '27', name: 'Seated Cable Row', muscleGroups: ['back', 'lats'], type: 'compound', equipment: ['cable'], difficulty: 'beginner' },
  { id: '28', name: 'Single-Arm Dumbbell Row', muscleGroups: ['back', 'lats'], type: 'compound', equipment: ['dumbbell', 'bench'], difficulty: 'beginner' },
  { id: '29', name: 'Chest-Supported Row', muscleGroups: ['back'], type: 'compound', equipment: ['dumbbell', 'machine'], difficulty: 'intermediate' },
  { id: '30', name: 'Face Pulls', muscleGroups: ['back', 'shoulders'], type: 'isolation', equipment: ['cable', 'bands'], difficulty: 'beginner' },
  { id: '31', name: 'Shrug', muscleGroups: ['traps'], type: 'isolation', equipment: ['barbell', 'dumbbell'], difficulty: 'beginner' },
  
  // More Legs
  { id: '32', name: 'Front Squat', muscleGroups: ['legs', 'quadriceps'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  { id: '33', name: 'Hack Squat', muscleGroups: ['legs', 'quadriceps'], type: 'compound', equipment: ['machine'], difficulty: 'intermediate' },
  { id: '34', name: 'Bulgarian Split Squat', muscleGroups: ['legs', 'quadriceps', 'glutes'], type: 'compound', equipment: ['dumbbell', 'bench'], difficulty: 'intermediate' },
  { id: '35', name: 'Goblet Squat', muscleGroups: ['legs', 'quadriceps'], type: 'compound', equipment: ['dumbbell', 'kettlebell'], difficulty: 'beginner' },
  { id: '36', name: 'Leg Extensions', muscleGroups: ['quadriceps'], type: 'isolation', equipment: ['machine'], difficulty: 'beginner' },
  { id: '37', name: 'Leg Curls', muscleGroups: ['hamstrings'], type: 'isolation', equipment: ['machine'], difficulty: 'beginner' },
  { id: '38', name: 'Standing Calf Raises', muscleGroups: ['calves'], type: 'isolation', equipment: ['machine', 'bodyweight'], difficulty: 'beginner' },
  { id: '39', name: 'Seated Calf Raises', muscleGroups: ['calves'], type: 'isolation', equipment: ['machine'], difficulty: 'beginner' },
  { id: '40', name: 'Hip Thrust', muscleGroups: ['glutes', 'hamstrings'], type: 'compound', equipment: ['barbell', 'bench'], difficulty: 'intermediate' },
  
  // More Shoulders
  { id: '41', name: 'Dumbbell Shoulder Press', muscleGroups: ['shoulders'], type: 'compound', equipment: ['dumbbell'], difficulty: 'intermediate' },
  { id: '42', name: 'Arnold Press', muscleGroups: ['shoulders'], type: 'compound', equipment: ['dumbbell'], difficulty: 'intermediate' },
  { id: '43', name: 'Front Raises', muscleGroups: ['shoulders'], type: 'isolation', equipment: ['dumbbell', 'barbell'], difficulty: 'beginner' },
  { id: '44', name: 'Rear Delt Flyes', muscleGroups: ['shoulders', 'back'], type: 'isolation', equipment: ['dumbbell'], difficulty: 'beginner' },
  { id: '45', name: 'Upright Row', muscleGroups: ['shoulders', 'traps'], type: 'compound', equipment: ['barbell', 'dumbbell'], difficulty: 'intermediate' },
  
  // More Arms
  { id: '46', name: 'Hammer Curls', muscleGroups: ['biceps', 'forearms'], type: 'isolation', equipment: ['dumbbell'], difficulty: 'beginner' },
  { id: '47', name: 'Preacher Curls', muscleGroups: ['biceps'], type: 'isolation', equipment: ['barbell', 'dumbbell', 'bench'], difficulty: 'intermediate' },
  { id: '48', name: 'Incline Curls', muscleGroups: ['biceps'], type: 'isolation', equipment: ['dumbbell', 'bench'], difficulty: 'intermediate' },
  { id: '49', name: 'Concentration Curls', muscleGroups: ['biceps'], type: 'isolation', equipment: ['dumbbell'], difficulty: 'beginner' },
  { id: '50', name: 'Cable Curls', muscleGroups: ['biceps'], type: 'isolation', equipment: ['cable'], difficulty: 'beginner' },
  { id: '51', name: 'Skull Crushers', muscleGroups: ['triceps'], type: 'isolation', equipment: ['barbell', 'dumbbell'], difficulty: 'intermediate' },
  { id: '52', name: 'Close-Grip Bench Press', muscleGroups: ['triceps', 'chest'], type: 'compound', equipment: ['barbell', 'bench'], difficulty: 'intermediate' },
  { id: '53', name: 'Dips', muscleGroups: ['triceps', 'chest', 'shoulders'], type: 'compound', equipment: ['bodyweight'], difficulty: 'intermediate' },
  { id: '54', name: 'Overhead Tricep Extension', muscleGroups: ['triceps'], type: 'isolation', equipment: ['dumbbell', 'cable'], difficulty: 'beginner' },
  { id: '55', name: 'Diamond Push-Ups', muscleGroups: ['triceps', 'chest'], type: 'compound', equipment: ['bodyweight'], difficulty: 'intermediate' },
  
  // More Core
  { id: '56', name: 'Crunches', muscleGroups: ['abs'], type: 'isolation', equipment: ['bodyweight'], difficulty: 'beginner' },
  { id: '57', name: 'Leg Raises', muscleGroups: ['abs'], type: 'isolation', equipment: ['bodyweight'], difficulty: 'intermediate' },
  { id: '58', name: 'Russian Twists', muscleGroups: ['abs'], type: 'isolation', equipment: ['bodyweight', 'medicine ball'], difficulty: 'intermediate' },
  { id: '59', name: 'Mountain Climbers', muscleGroups: ['abs', 'legs'], type: 'compound', equipment: ['bodyweight'], difficulty: 'intermediate' },
  { id: '60', name: 'Dead Bug', muscleGroups: ['abs'], type: 'isolation', equipment: ['bodyweight'], difficulty: 'beginner' },
  { id: '61', name: 'Bird Dog', muscleGroups: ['abs', 'back'], type: 'isolation', equipment: ['bodyweight'], difficulty: 'beginner' },
  { id: '62', name: 'Cable Crunches', muscleGroups: ['abs'], type: 'isolation', equipment: ['cable'], difficulty: 'intermediate' },
  { id: '63', name: 'Ab Wheel Rollouts', muscleGroups: ['abs'], type: 'isolation', equipment: ['bodyweight'], difficulty: 'advanced' },
  { id: '64', name: 'Side Plank', muscleGroups: ['abs'], type: 'isolation', equipment: ['bodyweight'], difficulty: 'intermediate' },
  
  // Cardio
  { id: '65', name: 'Burpees', muscleGroups: ['legs', 'chest', 'shoulders'], type: 'compound', equipment: ['bodyweight'], difficulty: 'intermediate' },
  { id: '66', name: 'High Knees', muscleGroups: ['legs'], type: 'cardio', equipment: ['bodyweight'], difficulty: 'beginner' },
  { id: '67', name: 'Jumping Jacks', muscleGroups: ['legs'], type: 'cardio', equipment: ['bodyweight'], difficulty: 'beginner' },
  { id: '68', name: 'Box Jumps', muscleGroups: ['legs'], type: 'compound', equipment: ['bodyweight'], difficulty: 'intermediate' },
  { id: '69', name: 'Sprints', muscleGroups: ['legs'], type: 'cardio', equipment: ['bodyweight'], difficulty: 'intermediate' },
  { id: '70', name: 'Kettlebell Swings', muscleGroups: ['legs', 'back'], type: 'compound', equipment: ['kettlebell'], difficulty: 'intermediate' },
  { id: '71', name: 'Battle Ropes', muscleGroups: ['shoulders', 'biceps', 'triceps'], type: 'cardio', equipment: ['bodyweight'], difficulty: 'intermediate' },
  { id: '72', name: 'Stair Climbing', muscleGroups: ['legs'], type: 'cardio', equipment: ['bodyweight'], difficulty: 'beginner' },
  { id: '73', name: 'Rowing Machine', muscleGroups: ['back', 'legs'], type: 'cardio', equipment: ['machine'], difficulty: 'beginner' },
  
  // Olympic Lifts
  { id: '74', name: 'Power Clean', muscleGroups: ['back', 'legs', 'shoulders'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  { id: '75', name: 'Snatch', muscleGroups: ['back', 'legs', 'shoulders'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  { id: '76', name: 'Clean and Jerk', muscleGroups: ['back', 'legs', 'shoulders'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  { id: '77', name: 'Hang Clean', muscleGroups: ['back', 'legs', 'shoulders'], type: 'compound', equipment: ['barbell'], difficulty: 'intermediate' },
  { id: '78', name: 'Power Snatch', muscleGroups: ['back', 'legs', 'shoulders'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  
  // Additional Exercises
  { id: '79', name: 'Good Mornings', muscleGroups: ['hamstrings', 'back'], type: 'compound', equipment: ['barbell'], difficulty: 'intermediate' },
  { id: '80', name: 'Glute-Ham Raise', muscleGroups: ['hamstrings', 'glutes'], type: 'isolation', equipment: ['machine'], difficulty: 'advanced' },
  { id: '81', name: 'Hip Abduction', muscleGroups: ['legs'], type: 'isolation', equipment: ['machine'], difficulty: 'beginner' },
  { id: '82', name: 'Hip Adduction', muscleGroups: ['legs'], type: 'isolation', equipment: ['machine'], difficulty: 'beginner' },
  { id: '83', name: 'Cable Pull-Through', muscleGroups: ['glutes', 'hamstrings'], type: 'compound', equipment: ['cable'], difficulty: 'beginner' },
  { id: '84', name: 'Zercher Squat', muscleGroups: ['legs', 'back'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  { id: '85', name: 'Safety Bar Squat', muscleGroups: ['legs'], type: 'compound', equipment: ['barbell'], difficulty: 'intermediate' },
  { id: '86', name: 'Landmine Press', muscleGroups: ['shoulders', 'chest'], type: 'compound', equipment: ['barbell'], difficulty: 'intermediate' },
  { id: '87', name: 'Floor Press', muscleGroups: ['chest', 'triceps'], type: 'compound', equipment: ['barbell'], difficulty: 'intermediate' },
  { id: '88', name: 'Spoto Press', muscleGroups: ['chest'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  { id: '89', name: 'Pin Press', muscleGroups: ['chest', 'triceps'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  { id: '90', name: 'JM Press', muscleGroups: ['triceps', 'chest'], type: 'compound', equipment: ['barbell'], difficulty: 'advanced' },
  { id: '91', name: 'Tate Press', muscleGroups: ['triceps'], type: 'isolation', equipment: ['dumbbell'], difficulty: 'intermediate' },
  { id: '92', name: 'Rolling Tricep Extensions', muscleGroups: ['triceps'], type: 'isolation', equipment: ['dumbbell'], difficulty: 'intermediate' },
  { id: '93', name: 'Incline Curls', muscleGroups: ['biceps'], type: 'isolation', equipment: ['dumbbell', 'bench'], difficulty: 'intermediate' },
  { id: '94', name: 'Spider Curls', muscleGroups: ['biceps'], type: 'isolation', equipment: ['dumbbell', 'bench'], difficulty: 'intermediate' },
  { id: '95', name: 'Drag Curls', muscleGroups: ['biceps', 'traps'], type: 'compound', equipment: ['barbell'], difficulty: 'intermediate' },
  { id: '96', name: 'Cable Curls', muscleGroups: ['biceps'], type: 'isolation', equipment: ['cable'], difficulty: 'beginner' },
  { id: '97', name: 'Reverse Curls', muscleGroups: ['biceps', 'forearms'], type: 'isolation', equipment: ['barbell'], difficulty: 'beginner' },
  { id: '98', name: 'Zottman Curls', muscleGroups: ['biceps', 'forearms'], type: 'isolation', equipment: ['dumbbell'], difficulty: 'intermediate' },
  { id: '99', name: 'Wrist Curls', muscleGroups: ['forearms'], type: 'isolation', equipment: ['barbell', 'dumbbell'], difficulty: 'beginner' },
  { id: '100', name: 'Reverse Wrist Curls', muscleGroups: ['forearms'], type: 'isolation', equipment: ['barbell', 'dumbbell'], difficulty: 'beginner' }
];

// Combine all exercises
export const allExercises: Exercise[] = [...exercises, ...additionalExercises.map(e => ({
  ...e,
  description: e.description || `${e.name} exercise`,
  instructions: e.instructions || ['Perform with proper form', 'Control the movement', 'Breathe steadily'],
  tips: e.tips || ['Focus on form', 'Use appropriate weight']
})) as Exercise[]];

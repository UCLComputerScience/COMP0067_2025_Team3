import { prisma } from './client'
import { initialiseUsersAndResponses } from './seeds/users'
async function initialiseQuestions() {
  const NMSK1 = await prisma.question.create({
    data: {
      question: 'Joint instability',
      note: "(e.g. subluxations, dislocations, joints feeling 'out of place', joints that are 'giving way').",
      domain: 'Neuromusculoskeletal',
      code: 'NMSK1'
    }
  })
  const NMSK2 = await prisma.question.create({
    data: {
      question: 'Muscle weakness',
      note: '(e.g. Your head / limbs may feel as if they weigh too much – Your arms, hands or legs feel may feel weak - Your muscles may not feel strong enough)',
      domain: 'Neuromusculoskeletal',
      code: 'NMSK2'
    }
  })
  const NMSK3 = await prisma.question.create({
    data: {
      question: 'Muscle spasms',
      note: '(e.g. sensation of muscle tightness, sensation of muscle contractions, …)',
      domain: 'Neuromusculoskeletal',
      code: 'NMSK3'
    }
  })
  const NMSK4 = await prisma.question.create({
    data: {
      question: 'Problems with balance and proprioception (sensing the position of your body and limbs)',
      note: '(e.g. Walking into objects, tripping, falling, losing balance, difficulty in sensing where a body part is or how a joint is positioned)',
      domain: 'Neuromusculoskeletal',
      code: 'NMSK4'
    }
  })
  const NMSK5 = await prisma.question.create({
    data: {
      question: 'Tingling sensations or loss of sensation in your limbs and/or other body areas',
      domain: 'Neuromusculoskeletal',
      code: 'NMSK5'
    }
  })

  const PAIN1 = await prisma.question.create({
    data: {
      question: 'Joint pain',
      note: 'We want to know specifically about the pain in your joints. Please try to not rate pain outside the joints (such as muscle pain, radiating nerve pain).',
      domain: 'Pain',
      code: 'PAIN1'
    }
  })
  const PAIN2 = await prisma.question.create({
    data: {
      question: 'Widespread pain in other areas of your body, such as legs, back, arms, spine …',
      domain: 'Pain',
      code: 'PAIN2'
    }
  })
  const PAIN3 = await prisma.question.create({
    data: {
      question: 'Headaches or migraines',
      domain: 'Pain',
      code: 'PAIN3'
    }
  })
  const PAIN4 = await prisma.question.create({
    data: {
      question: 'Pain provoked by sensations that would not be painful to most people',
      note: 'e.g. the pressure of clothes, someone touching you, touching the bedclothes, small movements, ...',
      domain: 'Pain',
      code: 'PAIN4'
    }
  })

  const FATIGUE1 = await prisma.question.create({
    data: {
      question: 'Feeling physically tired after efforts that are mild or minimal for others of your age',
      note: '(e.g. walking, household chores, etc.)',
      domain: 'Fatigue',
      code: 'FATIGUE1'
    }
  })
  const FATIGUE2 = await prisma.question.create({
    data: {
      question: 'Feeling mentally tired after efforts that are mild or minimal for others of your age',
      note: '(e.g. reading, studying, talking, etc.)',
      domain: 'Fatigue',
      code: 'FATIGUE2'
    }
  })
  const FATIGUE3 = await prisma.question.create({
    data: {
      question: 'Difficulty falling asleep, or difficulty staying asleep',
      domain: 'Fatigue',
      code: 'FATIGUE3'
    }
  })

  const GI1 = await prisma.question.create({
    data: {
      question: 'Abdominal bloating and/or pain',
      domain: 'Gastrointestinal',
      code: 'GI1'
    }
  })
  const GI2 = await prisma.question.create({
    data: {
      question: 'Diarrhoea and/or constipation',
      domain: 'Gastrointestinal',
      code: 'GI2'
    }
  })
  const GI3 = await prisma.question.create({
    data: {
      question: 'Nausea and/or vomiting',
      domain: 'Gastrointestinal',
      code: 'GI3'
    }
  })
  const GI4 = await prisma.question.create({
    data: {
      question: 'Reflux or regurgitation or difficulty swallowing',
      domain: 'Gastrointestinal',
      code: 'GI4'
    }
  })

  const CD1 = await prisma.question.create({
    data: {
      question:
        'Feeling faint, near fainting or having a racing heart, when moving to standing from a sitting or lying position',
      domain: 'Cardiac Dysautonomia',
      code: 'CD1'
    }
  })
  const CD2 = await prisma.question.create({
    data: {
      question:
        'Feeling faint, near fainting or having a racing heart when standing upright for a long time (e.g. waiting in line, in public transport, …)',
      domain: 'Cardiac Dysautonomia',
      code: 'CD2'
    }
  })
  const CD3 = await prisma.question.create({
    data: {
      question:
        'In which of the situations below do you have a racing heart, feel faint or as if you are near fainting? (Check all that apply):',
      domain: 'Cardiac Dysautonomia',
      code: 'CD3'
    }
  })
  const CD4 = await prisma.question.create({
    data: {
      question:
        'How would you rate the impact on your daily life, including school/work, tasks, social activities and hobbies?',
      domain: 'Cardiac Dysautonomia',
      code: 'CD4'
    }
  })

  const UG1 = await prisma.question.create({
    data: {
      question: 'Sensation of a full bladder, or a frequent urge to go to the toilet to empty the bladder',
      domain: 'Urogenital',
      code: 'UG1'
    }
  })
  const UG2 = await prisma.question.create({
    data: {
      question:
        'Urine loss: this may include rushing to the toilet and getting there too late, leaking urine involuntarily during activities, not feeling urine coming out or wetting the bed',
      domain: 'Urogenital',
      code: 'UG2'
    }
  })
  const UG3 = await prisma.question.create({
    data: {
      question:
        'Difficulty passing urine (having to push to wee) or difficulty emptying the bladder completely (the bladder does not feel empty after the toilet visit)',
      domain: 'Urogenital',
      code: 'UG3'
    }
  })
  const UG4 = await prisma.question.create({
    data: {
      question: 'Unexplained genital discomfort',
      domain: 'Urogenital',
      code: 'UG4'
    }
  })
  const UG5 = await prisma.question.create({
    data: {
      question:
        'How often have you had suspected urinary infections over the last year? Symptoms may include: pain when having to wee, bladder pain, having to wee very often',
      domain: 'Urogenital',
      code: 'UG5'
    }
  })

  const ANX1 = await prisma.question.create({
    data: {
      question:
        'Fear of moving or exercising, because of the risk of dislocations/ subluxations, pain or fatigue symptoms',
      domain: 'Anxiety',
      code: 'ANX1'
    }
  })
  const ANX2 = await prisma.question.create({
    data: {
      question: 'Feeling worried, restless or unable to relax',
      domain: 'Anxiety',
      code: 'ANX2'
    }
  })
  const ANX3 = await prisma.question.create({
    data: {
      question: 'Feeling afraid as if something awful might happen',
      domain: 'Anxiety',
      code: 'ANX3'
    }
  })

  const DEP1 = await prisma.question.create({
    data: {
      question: 'Feeling down, sad, or hopeless',
      domain: 'Depression',
      code: 'DEP1'
    }
  })
  const DEP2 = await prisma.question.create({
    data: {
      question: 'Feeling as though there are no solutions to your health problems',
      domain: 'Depression',
      code: 'DEP2'
    }
  })
  const DEP3 = await prisma.question.create({
    data: {
      question: 'Little interest or pleasure in doing things',
      domain: 'Depression',
      code: 'DEP3'
    }
  })
  console.log(
    NMSK1,
    NMSK2,
    NMSK3,
    NMSK4,
    NMSK5,
    PAIN1,
    PAIN2,
    PAIN3,
    PAIN4,
    FATIGUE1,
    FATIGUE2,
    FATIGUE3,
    GI1,
    GI2,
    GI3,
    GI4,
    CD1,
    CD2,
    CD3,
    CD4,
    UG1,
    UG2,
    UG3,
    UG4,
    UG5,
    ANX1,
    ANX2,
    ANX3,
    DEP1,
    DEP2,
    DEP3
  )
}

async function main() {
  await initialiseQuestions()
  await initialiseUsersAndResponses()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

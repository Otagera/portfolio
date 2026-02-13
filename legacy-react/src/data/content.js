export const writing = [
  {
    slug: 'optimizing-postgresql',
    title: 'Optimizing PostgreSQL for high-concurrency',
    date: 'Feb 2026',
    readTime: '5 min',
    summary: 'How we reduced lock contention by 60% using partitioning and fine-tuned vacuum settings.'
  },
  {
    slug: 'rest-to-grpc',
    title: 'Why I moved from REST to gRPC for internal services',
    date: 'Jan 2026',
    readTime: '8 min',
    summary: 'Evaluating Protobuf efficiency and stream-based communication in a microservices architecture.'
  },
  // ADD NEW POSTS HERE:
  // {
  //   slug: 'my-new-post',
  //   title: 'The future of Backend Engineering',
  //   date: 'March 2026',
  //   readTime: '4 min',
  //   summary: 'A short note on local-first development.'
  // }
];

export const projects = [
  {
    title: 'Job Listing',
    desc: 'Scalable job board backend with MongoDB and Express.',
    tech: ['Node.js', 'Express', 'MongoDB'],
    link: 'https://github.com/Otagera/job-listings',
    year: '2021'
  },
  {
    title: 'E-Voting Platform',
    desc: 'Real-time voting system with Redux and Node.js.',
    tech: ['React', 'Node.js', 'MongoDB'],
    link: 'https://github.com/Otagera/e-voting',
    year: '2020'
  },
  {
    title: 'Sales App Engine',
    desc: 'Inventory tracking system with Express and MongoDB.',
    tech: ['Express', 'MongoDB', 'EJS'],
    link: 'https://github.com/Otagera/Sales-App-Express',
    year: '2020'
  }
];

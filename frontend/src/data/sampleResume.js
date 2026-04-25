export const SAMPLE_RESUME = {
  title: 'Senior Software Engineer',
  template: 'overleaf-jake',
  personalDetails: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@email.com',
    phone: '+1 (555) 321-9087',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    website: 'alexmorgan.dev',
    summary:
      'Results-driven software engineer with 6+ years building scalable platforms, leading cross-functional delivery, and improving reliability across distributed systems.'
  },
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S.',
      fieldOfStudy: 'Computer Science',
      startDate: '2014',
      endDate: '2018',
      gpa: '3.8',
      description: ''
    }
  ],
  experience: [
    {
      company: 'CloudNest',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: '',
      highlights: [
        'Led migration to event-driven services, reducing API latency by 38%.',
        'Improved deployment reliability with canary rollouts and observability dashboards.',
        'Mentored 4 engineers and established engineering standards for code quality.'
      ]
    },
    {
      company: 'Bitline Labs',
      position: 'Software Engineer',
      location: 'Remote',
      startDate: '2018',
      endDate: '2022',
      current: false,
      description: '',
      highlights: [
        'Built customer-facing React and Node.js modules used by 100k+ monthly users.',
        'Optimized SQL workloads, lowering reporting time from 45s to 8s.',
        'Partnered with product and design to ship a major onboarding revamp.'
      ]
    }
  ],
  skills: [
    {
      category: 'Languages',
      items: ['JavaScript', 'TypeScript', 'Python', 'SQL']
    },
    {
      category: 'Frameworks',
      items: ['React', 'Node.js', 'Express', 'Next.js']
    },
    {
      category: 'Cloud & DevOps',
      items: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions']
    }
  ],
  projects: [
    {
      name: 'Realtime Hiring Analytics',
      description:
        'Built a streaming analytics dashboard for recruiter workflows with sub-second updates.',
      technologies: ['React', 'Node.js', 'Kafka', 'PostgreSQL'],
      link: '',
      startDate: '2023',
      endDate: '2024'
    }
  ],
  latexSource: '',
  isLatexResume: false
};

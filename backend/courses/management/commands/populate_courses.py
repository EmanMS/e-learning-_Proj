from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course, Module, Content
from assessments.models import Quiz, Question, Assignment

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with sample courses'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample courses...')
        
        # Get or create an instructor user
        instructor, created = User.objects.get_or_create(
            username='instructor_demo',
            defaults={
                'email': 'instructor@example.com',
                'role': 'INSTRUCTOR',
                'first_name': 'Demo',
                'last_name': 'Instructor'
            }
        )
        if created:
            instructor.set_password('demo123')
            instructor.save()
            self.stdout.write(self.style.SUCCESS(f'Created instructor: {instructor.username}'))

        # Sample courses data
        courses_data = [
            {
                'title': 'Python Programming for Beginners',
                'description': 'Learn Python from scratch with hands-on projects and real-world examples. Perfect for absolute beginners who want to start their programming journey.',
                'price': 49.99,
                'modules': [
                    {
                        'title': 'Introduction to Python',
                        'order': 1,
                        'contents': [
                            {'title': 'What is Python?', 'content_type': 'TEXT', 'text_content': 'Python is a high-level, interpreted programming language known for its simplicity and readability.'},
                            {'title': 'Installing Python', 'content_type': 'VIDEO', 'url': 'https://www.youtube.com/watch?v=YYXdXT2l-Gg'},
                        ]
                    },
                    {
                        'title': 'Python Basics',
                        'order': 2,
                        'contents': [
                            {'title': 'Variables and Data Types', 'content_type': 'TEXT', 'text_content': 'Learn about variables, strings, numbers, and basic data types in Python.'},
                            {'title': 'Control Flow', 'content_type': 'TEXT', 'text_content': 'Understanding if statements, loops, and conditional logic.'},
                        ]
                    }
                ]
            },
            {
                'title': 'Web Development with React',
                'description': 'Master modern web development with React.js. Build interactive user interfaces and single-page applications.',
                'price': 79.99,
                'modules': [
                    {
                        'title': 'React Fundamentals',
                        'order': 1,
                        'contents': [
                            {'title': 'Introduction to React', 'content_type': 'TEXT', 'text_content': 'React is a JavaScript library for building user interfaces, maintained by Facebook.'},
                            {'title': 'JSX and Components', 'content_type': 'VIDEO', 'url': 'https://www.youtube.com/watch?v=Ke90Tje7VS0'},
                        ]
                    }
                ]
            },
            {
                'title': 'Data Science with Python',
                'description': 'Dive into data science using Python. Learn pandas, NumPy, and data visualization techniques.',
                'price': 89.99,
                'modules': [
                    {
                        'title': 'Data Analysis Basics',
                        'order': 1,
                        'contents': [
                            {'title': 'Introduction to Data Science', 'content_type': 'TEXT', 'text_content': 'Data science combines statistics, programming, and domain expertise to extract insights from data.'},
                        ]
                    }
                ]
            },
            {
                'title': 'Machine Learning Fundamentals',
                'description': 'Understand the core concepts of machine learning and build your first ML models.',
                'price': 99.99,
                'modules': [
                    {
                        'title': 'ML Basics',
                        'order': 1,
                        'contents': [
                            {'title': 'What is Machine Learning?', 'content_type': 'TEXT', 'text_content': 'Machine learning is a subset of AI that enables systems to learn from data.'},
                        ]
                    }
                ]
            },
            {
                'title': 'Introduction to Git and GitHub',
                'description': 'Learn version control with Git and collaborate on projects using GitHub. Essential for all developers.',
                'price': 0,  # Free course
                'modules': [
                    {
                        'title': 'Git Basics',
                        'order': 1,
                        'contents': [
                            {'title': 'What is Version Control?', 'content_type': 'TEXT', 'text_content': 'Version control systems help track changes in code over time.'},
                            {'title': 'Git Installation', 'content_type': 'VIDEO', 'url': 'https://www.youtube.com/watch?v=8JJ101D3knE'},
                        ]
                    }
                ]
            },
            {
                'title': 'SQL Database Design',
                'description': 'Master SQL and database design principles. Learn to create, query, and optimize databases.',
                'price': 59.99,
                'modules': [
                    {
                        'title': 'Database Fundamentals',
                        'order': 1,
                        'contents': [
                            {'title': 'Introduction to Databases', 'content_type': 'TEXT', 'text_content': 'Databases are organized collections of data that can be easily accessed and managed.'},
                        ]
                    }
                ]
            }
        ]

        # Create courses
        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                title=course_data['title'],
                instructor=instructor,
                defaults={
                    'description': course_data['description'],
                    'price': course_data['price']
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created course: {course.title}'))
                
                # Create modules and content
                for module_data in course_data['modules']:
                    module = Module.objects.create(
                        course=course,
                        title=module_data['title'],
                        order=module_data['order']
                    )
                    
                    for content_data in module_data['contents']:
                        Content.objects.create(
                            module=module,
                            **content_data
                        )
                    
                    self.stdout.write(f'  - Created module: {module.title}')
            else:
                self.stdout.write(self.style.WARNING(f'Course already exists: {course.title}'))

        self.stdout.write(self.style.SUCCESS('Sample courses created successfully!'))

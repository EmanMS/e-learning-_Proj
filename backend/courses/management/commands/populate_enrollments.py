from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course, Enrollment
from progress.models import Progress
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create fake enrollments for students in existing courses'

    def handle(self, *args, **kwargs):
        # Get all students
        students = User.objects.filter(role='STUDENT')
        if not students.exists():
            self.stdout.write(self.style.ERROR('No students found. Please create student accounts first.'))
            return

        # Get all courses
        courses = Course.objects.all()
        if not courses.exists():
            self.stdout.write(self.style.ERROR('No courses found. Please create courses first.'))
            return

        self.stdout.write(f'Found {students.count()} students and {courses.count()} courses')

        enrollments_created = 0
        progress_created = 0

        for student in students:
            # Enroll each student in 2-5 random courses
            num_enrollments = random.randint(2, min(5, courses.count()))
            selected_courses = random.sample(list(courses), num_enrollments)

            for course in selected_courses:
                # Create enrollment if it doesn't exist
                enrollment, created = Enrollment.objects.get_or_create(
                    student=student,
                    course=course
                )
                
                if created:
                    enrollments_created += 1
                    self.stdout.write(f'Enrolled {student.username} in {course.title}')

                    # Create random progress for this enrollment
                    # Get all content items in this course
                    all_content = []
                    for module in course.modules.all():
                        all_content.extend(module.contents.all())

                    if all_content:
                        # Mark 30-70% of content as completed
                        completion_rate = random.uniform(0.3, 0.7)
                        num_to_complete = int(len(all_content) * completion_rate)
                        completed_content = random.sample(all_content, num_to_complete)

                        for content in completed_content:
                            progress, prog_created = Progress.objects.get_or_create(
                                user=student,
                                content=content,
                                defaults={'is_completed': True}
                            )
                            if prog_created:
                                progress_created += 1

        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {enrollments_created} enrollments and {progress_created} progress records'
        ))

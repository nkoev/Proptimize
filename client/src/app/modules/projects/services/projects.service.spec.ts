import { TestBed, async } from '@angular/core/testing';
import { ProjectService } from './project.service'
import { FirestoreMock } from 'src/test-helpers/firestore-mock';
import { EmployeeService } from '../../employees/services/employee.service';
import { UserService } from '../../employees/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { SkillDTO } from 'src/app/models/skills/skill.dto';
import { UserDTO } from 'src/app/models/employees/user.dto';

describe('ProjectService', () => {
    let employeeService = {
        addProject: jest.fn().mockReturnThis(),
        removeProject: jest.fn().mockReturnThis(),
    };
    let userService = {
        addProject: jest.fn().mockReturnThis(),
        removeProject: jest.fn().mockReturnThis(),
    };
    let notificationService = {
        success: jest.fn().mockReturnThis(),
    };

    let service: ProjectService;
    let firestoreMock: FirestoreMock;

    beforeEach(() => {
        jest.clearAllMocks();
        firestoreMock = new FirestoreMock();

        TestBed.configureTestingModule({
            providers: [
                ProjectService,
                { provide: AngularFirestore, useValue: firestoreMock },
                { provide: EmployeeService, useValue: employeeService },
                { provide: UserService, useValue: userService },
                { provide: NotificationService, useValue: notificationService },
            ],
        });

        service = TestBed.inject(ProjectService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(firestoreMock.mockCollection).toHaveBeenCalledWith('projects');
    });

    describe('getAll method', () => {
        it('should call projects collection snapshotChanges method', (done) => {
            service.getAll().subscribe(() => {
                expect(firestoreMock.mockSnapshotChanges).toHaveBeenCalled();
                done();
            });
        });

        it('should emit correct value from projects collection snapshotChanges method', (done) => {
            firestoreMock.mockSnapshotChanges = jest.fn(() => of([{ payload: { doc: { data: () => [1], id: '123' } } }]));
            service.getAll().subscribe((res) => {
                expect(res).toEqual([{ "0": 1, "id": "123" }] as any);
                done();
            });
        });
    });

    describe('getProjectById', () => {
        it('should call projects collection doc method with correct arguments', async(() => {
            firestoreMock.mockGetReturn = { data: () => 'test data' };
            service.getProjectById('testId').then(() => {
                expect(firestoreMock.mockDoc).toHaveBeenCalledWith('testId');
            });
        }));

        it('should call projects collection doc ref get method', async(() => {
            firestoreMock.mockGetReturn = { data: () => 'test data' };
            service.getProjectById('testId').then(() => {
                expect(firestoreMock.mockGet).toHaveBeenCalled();
            });
        }));

        it('should return correct doc data and id', async(() => {
            firestoreMock.mockGetReturn = {
                doc: { data: 'data', id: '123' }
            };
            service.getProjectById('testId').then((res) => {
                expect(res).toEqual({ doc: { data: 'data', id: '123' } } as any);
            });
        }));
    });

    describe('addProject', () => {
        const projectData = {
            name: 'pro',
            description: 'test',
            targetInDays: 5,
            manTarget: 4,
            manHours: 1,
            skills: [] as SkillDTO[],
        };
        const loggedUser: UserDTO = {
            id: '1234',
            email: 'a@a.a',
            firstName: 'Georgi',
            lastName: 'Georgiev',
            position: 'chef',
            managedBy: '12345',
            isAdmin: false,
            availableHours: 3,
            projects: []
        };

        it('should call assignProjectToUser with correct arguments', async(() => {
            firestoreMock.mockAdd = jest.fn(() => Promise.resolve({ id: '12' }));
            jest.spyOn(global, 'Date').mockImplementation(() => '12.12.2020');
            service.addProject(projectData, loggedUser).then(() => {
                expect(firestoreMock.mockAdd).toHaveBeenCalledWith({
                    "createdAt": new Date(),
                    "description": "test",
                    "mCreatedAt": new Date(),
                    "mDone": 0,
                    "mUpdatedAt": new Date(),
                    "managementHours": 1,
                    "managementTarget": 4,
                    "name": "pro",
                    "reporter": {
                        "firstName": "Georgi",
                        "id": "1234",
                        "lastName": "Georgiev"
                    }, "skills": [],
                    "status": "In Progress",
                    "targetInDays": 5,
                    "updatedAt": new Date()
                });
            });
        }));

        it('should call assignProjectToUser with correct arguments', async(() => {
            firestoreMock.mockAdd = jest.fn(() => Promise.resolve({ id: '12' }));
            jest.spyOn(notificationService, 'success').mockImplementation(() => '');
            service.addProject(projectData, loggedUser).then(() => {
                expect(notificationService.success).toHaveBeenCalledWith('Project was created');
            });
        }));
    });
});

import withProjectForm from 'data/projectFormQueries';
import ProjectForm from './ProjectForm';

export default withProjectForm(ProjectForm, { edit: true });

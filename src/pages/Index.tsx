import { Navigate } from 'react-router-dom';
import { useStore } from '@/lib/store';

const Index = () => {
  const currentUser = useStore(s => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'administrator') return <Navigate to="/admin/org-domains" replace />;
  return <Navigate to="/library/org-domains" replace />;
};

export default Index;

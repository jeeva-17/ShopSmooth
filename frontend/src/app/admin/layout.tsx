'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { StoreProvider } from '@/lib/store-context';
import { AuthProvider } from '@/lib/auth-context';
import { useEffect } from 'react';
import { useStore } from '@/lib/store-context';
import { useAuth } from '@/lib/auth-context';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { setStoreId } = useStore();
  const { user } = useAuth();

  useEffect(() => {
    // Set store ID from user's store_id or default to 1
    if (user?.store_id) {
      setStoreId(user.store_id);
    } else {
      setStoreId(1);
    }
  }, [user, setStoreId]);

  return <AdminLayout>{children}</AdminLayout>;
}

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <StoreProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </StoreProvider>
    </AuthProvider>
  );
}

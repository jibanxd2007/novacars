import React from 'react';
import NovaLoader from '@/components/NovaLoader';

export default function AdminLoading() {
  return <NovaLoader text="Connecting to Dealer OS..." subtext="Authenticating Session" />;
}

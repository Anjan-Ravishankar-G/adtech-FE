import Campaign from '@/app/components/ui/campaign';
import Header from '@/app/components/ui/header';
export default function Home() {
  return (
    <main className="container mx-auto ">
      <Header/>
      <Campaign />
    </main>
  );
}
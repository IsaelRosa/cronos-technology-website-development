import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { CmsProvider } from "@/store/cms";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CookieBanner, ScrollToTop, WhatsAppButton } from "@/components/Extras";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import Blog, { BlogPost } from "@/pages/Blog";
import Contact from "@/pages/Contact";
import { NotFound, Privacy } from "@/pages/Misc";
import { AdminDashboard, AdminLayout, AdminLogin } from "@/admin/AdminLayout";
import AdminProjects from "@/admin/AdminProjects";
import AdminServices from "@/admin/AdminServices";
import AdminBlog from "@/admin/AdminBlog";
import AdminMessages from "@/admin/AdminMessages";
import AdminSettings from "@/admin/AdminSettings";

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/solucoes" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin">
            <Route index element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="projetos" element={<AdminProjects />} />
              <Route path="servicos" element={<AdminServices />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="mensagens" element={<AdminMessages />} />
              <Route path="configuracoes" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </CmsProvider>
  );
}

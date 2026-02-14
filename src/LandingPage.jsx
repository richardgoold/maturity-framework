import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';
import {
  BarChart3, Target, TrendingUp, Award, CheckCircle2,
  ArrowRight, Star, Mail, ExternalLink, Linkedin,
  Shield, Users, Globe, ChevronRight
} from 'lucide-react';

// Screenshot paths — replace with actual screenshots
const SCREENSHOTS = {
  hero: '/maturity-framework/screenshots/dashboard-charts.svg',
  dashboard: '/maturity-framework/screenshots/dashboard-scores.svg',
  roadmap: '/maturity-framework/screenshots/gap-analysis.svg',
  assessment: '/maturity-framework/screenshots/assessment-view.svg',
};

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GrowthLens</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('how-it-works')} className="text-sm text-gray-600 hover:text-gray-900 transition">How It Works</button>
            <button onClick={() => scrollTo('features')} className="text-sm text-gray-600 hover:text-gray-900 transition">Features</button>
            <button onClick={() => scrollTo('testimonials')} className="text-sm text-gray-600 hover:text-gray-900 transition">Testimonials</button>
            <button onClick={() => scrollTo('contact')} className="text-sm text-gray-600 hover:text-gray-900 transition">Contact</button>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition">Log In</Link>
            <Link to="/signup" className="inline-flex items-center px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-semibold text-sm rounded-lg transition shadow-sm">
              Sign Up Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <button onClick={() => scrollTo('how-it-works')} className="text-left text-sm text-gray-600 py-2">How It Works</button>
              <button onClick={() => scrollTo('features')} className="text-left text-sm text-gray-600 py-2">Features</button>
              <button onClick={() => scrollTo('testimonials')} className="text-left text-sm text-gray-600 py-2">Testimonials</button>
              <button onClick={() => scrollTo('contact')} className="text-left text-sm text-gray-600 py-2">Contact</button>
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="text-sm text-gray-600 py-2">Log In</Link>
                <Link to="/signup" className="inline-flex items-center px-4 py-2 bg-amber-400 text-white font-semibold text-sm rounded-lg">Sign Up Free</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-medium mb-6">
            M&A Due Diligence Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            See what acquirers see
            <span className="text-amber-500"> — before they do.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Assess your firm across the 10 dimensions that drive value in professional services M&A.
            Benchmark against industry standards. Get a clear roadmap to maximise your exit.
          </p>

          {/* Tagline */}
          <p className="text-sm font-semibold text-amber-600 tracking-widest uppercase mb-8">
            Measure. Benchmark. Maximise.
          </p>

          {/* CTA */}
          <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white font-bold text-lg rounded-xl transition shadow-lg shadow-amber-200/50 gap-2">
�Yۈ\��YB�\���ԚY��\�Ә[YOH��MHMH�ς��[�ς��]�����ʈ\���ܙY[���[���\
��B�]��\�Ә[YOH�]LM�X^]�M^^X]]ȏ��]��\�Ә[YOH��[]]�H����ʈ�����\���[YH
��B�]��\�Ә[YOH���Yܘ^KNL��[�Y^�Y��L�ݙ\����ZY[�����ʈ�����\��\�
��B�]��\�Ә[YOH��^][\�X�[�\��\L�MKL���Yܘ^KN���]��\�Ә[YOH��^�\LK�H���]��\�Ә[YOH��L�L���[�YY�[��\�YM���]���]��\�Ә[YOH��L�L���[�YY�[��^Y[��M���]���]��\�Ә[YOH��L�L���[�YY�[��YܙY[�M���]����]���]��\�Ә[YOH��^LH^M���]��\�Ә[YOH���Yܘ^KM���[�Y[YL�KLH^Yܘ^KM^^ȏ��ܛ��[�˘\�\���\���]����]����]����ʈ�ܙY[���
��B�[Yܘ�^��ԑQS���˚\��B�[H�ܛ��[��\���\�8�%�Y\��\�[��[��X\����\\�\�ۈ���\�Ә[YOH��Y�[��ۑ\��܏^�JHO�K�\��]��[K�\�^HH	ۛۙI�K�\��]�\�[�[[Y[��]Y\�T�[X�܊	˜X�Z�\��O˘�\��\���[[ݙJ	�Y[��N_B�ς��ʈ�[�X��X�Z�\�
��B�]��\�Ә[YOH�X�Z�\�Y[�\�X�V�M��WH��YܘYY[�]�X�����KYܘ^KN�Yܘ^KNL�^][\�X�[�\��\�Y�KX�[�\����]��\�Ә[YOH�^X�[�\�^Yܘ^KM����\��\���\�Ә[YOH��LM�LM�^X]]�X�L�^X[X�\�M�ς��\�Ә[YOH�^[��۝[YY][H��\���\��]�Y]�����\�Ә[YOH�^\�H���Y\��\�	��[��X\����\\�\�ۏ����]����]����]����ʈX�ܘ]]�H���
��B�]��\�Ә[YOH�X���]HZ[��]M��X[X�\�M�L��[�YL��\�L�^�LL���]����]����]����]�����X�[ۏ��
NB���[��[ۈ�ܙY[����\�
�ܘ�[�\[ۈJH�]\��
�]��\�Ә[YOH�ܛ�\���]��\�Ә[YOH���Yܘ^KNL��[�Y^ݙ\����ZY[��Y��^�[�ٛܛH�[��][ۈܛ�\Zݙ\����[KV�K��Hܛ�\Zݙ\���Y��L�����ʈZ[�H�����\��\�
��B�]��\�Ә[YOH��^][\�X�[�\��\LK�HL�KL���Yܘ^KN���]��\�Ә[YOH��L�L���[�YY�[��\�YM���]���]��\�Ә[YOH��L�L���[�YY�[��^Y[��M���]���]��\�Ә[YOH��L�L���[�YY�[��YܙY[�M���]����]���[Yܘ�^�ܘ�B�[^�[B��\�Ә[YOH��Y�[��ۑ\��܏^�JHO�K�\��]��[K�\�^HH	ۛۙI�K�\��]�\�[�[[Y[��]Y\�T�[X�܊	˜X�Z�\��O˘�\��\���[[ݙJ	�Y[��N_B�ς�]��\�Ә[YOH�X�Z�\�Y[�\�X�V���H��YܘYY[�]�X�����KYܘ^KN�Yܘ^KNL�^][\�X�[�\��\�Y�KX�[�\����]��\�Ә[YOH�^X�[�\�^Yܘ^KMLM����\��\���\�Ә[YOH��LLLL^X]]�X�L�^X[X�\�M͌�ς��\�Ә[YOH�^\�H���[O����]����]����]����\�Ә[YOH�]M^X�[�\�^Yܘ^KM�^\�HXY[��\�[^Y����\[۟O����]���
NB���[��[ۈ�]�Y]���X�[ۊ
H�]\��
��X�[ۈ�\�Ә[YOH�KLM��N�KL���]�]H���]��\�Ә[YOH�X^]�M�^X]]�M�N�M�ΜN���]��\�Ә[YOH�^X�[�\�X�LL������\�Ә[YOH�^L��N�^M�۝X��^Yܘ^KNLX�M���]�\�][��[�H�YY�\��\��I�H�XY[�\������\�Ә[YOH�^[�^Yܘ^KM�X^]�L�^X]]ȏ�����H��X�\�Y\��\��Y[����\�X[\���\��8�%�YH[�\��\�H��Y�[�X�]Z\�\���^Y\˂�����]����]��\�Ә[YOH�ܚYܚYX���LHY�ܚYX���L��\N����ܙY[����\��ܘ�^��ԑQS���˙\���\�B�[H�\���\��]��ܙ\�[��XY[�\��۝]���\[ۏH��YH^X�H�\�H[�\��\�H�[��Y�Z[��I�K\�XYH�[��X\��Ȃ�ς��ܙY[����\��ܘ�^��ԑQS���˜��YX\B�[H��\[�[\�\�[�[\�ݙ[Y[���YX\���\[ۏH��]H�[ܚ]\�Y��YX\����HH�\�]X]\�[����ς��ܙY[����\��ܘ�^��ԑQS���˘\��\��Y[�B�[H�\��\��Y[��Y]��][Y\�[�Y]�X�Ȃ��\[ۏH�H��X�\�Y��[Y]�ܚ��ݙ\�[��L[Y\�[�

�ܛ��Y]�X�Ȃ�ς��]����]�����X�[ۏ��
NB���[��[ۈ��]�ܚ���X�[ۊ
H�ۜ��\�H��[N�K]N�	��Yۈ\	�\�Έ	�ܙX]H[�\���YHX���[�[���X�ۙ��X�ێ�\�\��K���[N��]N�	�\��\���\�Έ	Ԙ]H[�\��\�HXܛ���Lܛ��[Y\�[�

�Y]�X���X�ێ�\��]K���[N��]N�	Й[��X\���\�Έ	��YH��[�H��\\�HY�Z[��I�K\�XYH�[�\��[�
�[�\��H�[��X\����X�ێ��\��\��K���[N�
]N�	�X�	�\�Έ	��]H�[ܚ]\�Y[\�ݙ[Y[���YX\�X^[Z\�H[�\��\�W	���[YI�X�ێ��[�[��\K�N��]\��
��X�[ۈYH���Z]]�ܚ�Ȉ�\�Ә[YOH�KLM��N�KL���Yܘ^KML���]��\�Ә[YOH�X^]�M�^X]]�M�N�M�ΜN���]��\�Ә[YOH�^X�[�\�X�LM������\�Ә[YOH�^L��N�^M�۝X��^Yܘ^KNLX�M����]�ܚ�������\�Ә[YOH�^[�^Yܘ^KM�����\��\��[�\��[�[�X^[Z\�H[�\��\�I���[YO����]����]��\�Ә[YOH�ܚYܚYX���LH�N�ܚYX���L�ΙܚYX���M�\N�����\˛X\

�\JHO�
�]��^O^��\��[_H�\�Ә[YOH��[]]�H^X�[�\�����ʈ�ۛ�X�܈[�H
��B��H�\˛[��HH	��
�]��\�Ә[YOH�Y[�Θ����X���]H�LLY�V͌	WH�V�	WHL�H��X[X�\�L�����]��۔�Y��\�Ә[YOH�X���]H\�Y�L�]�L��MHMH^X[X�\�M�ς��]���
_B��ʈ�\�[X�\�
��B�]��\�Ә[YOH��L�L���X[X�\�ML�ܙ\�L��ܙ\�X[X�\�L���[�YL��^][\�X�[�\��\�Y�KX�[�\�^X]]�X�M����\�X�ۈ�\�Ә[YOH��NN^X[X�\�M��ς��]���]��\�Ә[YOH�[�[�KY�^][\�X�[�\��\�Y�KX�[�\��M�M���X[X�\�M^]�]H^\�H�۝X����[�YY�[X�Lȏ����\��[_B��]�����\�Ә[YOH�^[��۝X��^Yܘ^KNLX�L�����\�]_O�ς��\�Ә[YOH�^Yܘ^KM�^\�HXY[��\�[^Y����\�\��O����]���
J_B��]����]�����X�[ۏ��
NB���[��[ۈ�]И\�
H�ۜ��]�H��[YN�	�L	�X�[�	�ܛ��[Y\��K���[YN�	�
��X�[�	�Y]�X���K���[YN�	���X�[�	Й[��X\���ٚ[\��K���[YN�	̌
��X�[�	�[�\��H��\��\��K�N��]\��
�]��\�Ә[YOH���Yܘ^KNLKN���]��\�Ә[YOH�X^]�M�^X]]�M�N�M�ΜN���]��\�Ә[YOH�ܚYܚYX���L�Y�ܚYX���M�\M������]˛X\

�]
HO�
�]��^O^��]�X�[H�\�Ә[YOH�^X�[�\�����\�Ә[YOH�^L��N�^M�۝X��^X[X�\�M����]��[Y_O����\�Ә[YOH�^\�H^Yܘ^KM]LH����]�X�[O����]���
J_B��]����]����]���
NB���[��[ۈ\�[[ۚX[��X�[ۊ
H�ۜ�\�[[ۚX[�H][�N��\�\��\��Y[���\][H�[��Y���H[��X��]�\��\�I���XY[�\���܈^]�H�\[�[\�\�[ۙH�\��ܝ]8�%�HY�[�����HY��ۛ��^\�Y����[YN�	��\�ZZ]�[	��]N�	�X[�Y�[��\��\�X�����H�ۜ�[[��I���][�Έ
K�K�][�N���H\�Yܛ��[����[��X\���\��[�\��Y�ܙH\��X�[���^Y\�ˈH��X�\�Y��[Y]�ܚ��]�H\��ۙ�Y[��H[�[Y\���[X[�H�]\�][\K����[YN�	Ҙ[Y\�ܛ�ۉ��]N�	��S�X[�Y�[Y[��ۜ�[[��I���][�Έ
K�K�][�N���[�[KH��]�XZ��H[��XY�Hو�ٙ\��[ۘ[�\��X�\�I�K�H

�Y]�X���ݙ\�]�\�][��[�X�]Z\�\���[���]8�%��[��[�H��Y\����K����[YN�	�]�Y�[���]N�	ћ�[�\��[�[��X[Y�\�ܞH�\�I���][�Έ
K�K�N��]\��
��X�[ۈYH�\�[[ۚX[Ȉ�\�Ә[YOH�KLM��N�KL���]�]H���]��\�Ә[YOH�X^]�M�^X]]�M�N�M�ΜN���]��\�Ә[YOH�^X�[�\�X�LL������\�Ә[YOH�^L��N�^M�۝X��^Yܘ^KNLX�M����\�Y�H�\�HXY\������\�Ә[YOH�^[�^Yܘ^KM����YH�]�ٙ\��[ۘ[�\��X�\��\�H�ۙ\��\�H�^Z[������]����]��\�Ә[YOH�ܚYܚYX���LHY�ܚYX���L��\N����\�[[ۚX[˛X\

JHO�
�]��^O^�_H�\�Ә[YOH���Yܘ^KML��[�YL�N�ܙ\��ܙ\�Yܘ^KLL����ʈ�\��
��B�]��\�Ә[YOH��^�\LHX�M����\��^K����J�[�����][��JK�X\

��HO�
��\��^O^ڟH�\�Ә[YOH��MM�[X[X�\�M^X[X�\�M�ς�
J_B��]����\�Ә[YOH�^Yܘ^KM�XY[��\�[^YX�M�][Xȏ����][�_H����]����\�Ә[YOH��۝\�[ZX��^Yܘ^KNL�����[Y_O����\�Ә[YOH�^\�H^Yܘ^KML����]_O����]����]���
J_B��]����]�����X�[ۏ��
NB���[��[ۈ�X]\�\��X�[ۊ
H�]\��
��X�[ۈYH��X]\�\Ȉ�\�Ә[YOH�KLM��N�KL���Yܘ^KML���]��\�Ә[YOH�X^]�M�^X]]�M�N�M�ΜN���]��\�Ә[YOH�^X�[�\�X�LL������\�Ә[YOH�^L��N�^M�۝X��^Yܘ^KNLX�M����\���YK�\ܘYH�[�[�IܙH�XYK�������\�Ә[YOH�^[�^Yܘ^KM�X^]�L�^X]]ȏ��H��YHY\��]�\�[�H]�\�][��[�H�YY�[�\��[�[�\��\�I��I�H�XY[�\�˂��[Z][H[�����H����[\�ݙH]������]����]��\�Ә[YOH�ܚYܚYX���LHY�ܚYX���L��\NX^]�M^X]]ȏ���ʈ��YHY\�
��B�]��\�Ә[YOH���]�]H��[�YL�N�ܙ\��ܙ\�Yܘ^KL��Y��\�H���]��\�Ә[YOH�[�[�KY�^][\�X�[�\�L�KLH��Yܘ^KLL��[�YY�[^Yܘ^KM�^\�H�۝[YY][HX�M�����YB��]�����\�Ә[YOH�^L��۝X��^Yܘ^KNLX�L����]�\�Y�ς��\�Ә[YOH�^Yܘ^KM�X�M���]�\�][��[�H�YY�\��\��[�\��\�I���XY[�\�����[�\�Ә[YOH��X�K^KL�X�N����	ѝ[\��\��Y[�Xܛ���[L[Y\�[�

�Y]�X����	�\���\��]��ܙ\�[��\[�[\�\���	Й[��X\����\\�\�ۈY�Z[��
��ٚ[\���	�X]\�]HX]X\Xܛ���[[Y[��[ۜ���K�X\

][KJHO�
�H�^O^�_H�\�Ә[YOH��^][\�\�\��\Lȏ���X���\��L��\�Ә[YOH��MHMH^YܙY[�ML�^\��[��L]L�H�ς��[��\�Ә[YOH�^Yܘ^KM�^\�H���][_O��[����O��
J_B��[��[���H���Y۝\��\�Ә[YOH������Y�[^X�[�\�M�KL���Yܘ^KNLݙ\����Yܘ^KN^]�]H�۝\�[ZX����[�Y[��[��][ۈ����Yۈ\��YB��[�ς��]�����ʈ�[Z][HY\�
��B�]��\�Ә[YOH���]�]H��[�YL�N�ܙ\�L��ܙ\�X[X�\�M�Y��[��[]]�H���]��\�Ә[YOH�X���]H]�L��Y�M�L�KLH��X[X�\�M^]�]H^^��۝X����[�YY�[����P��SQS�Q��]���]��\�Ә[YOH�[�[�KY�^][\�X�[�\�L�KLH��X[X�\�ML��[�YY�[^X[X�\�M�^\�H�۝[YY][HX�M����[Z][B��]�����\�Ә[YOH�^L��۝X��^Yܘ^KNLX�L���X^[Z\�H�[YO�ς��\�Ә[YOH�^Yܘ^KM�X�M����܈�\�\��\�[�\�X��]�\\�[���܈^]���[�\�Ә[YOH��X�K^KL�X�N����	�]�\�][��[���YI��	�[\�ݙ[Y[���YX\�]�[ܚ]\�YX�[ۜ���	���[�\�[�[�[[��8�%�]ZY�[�[\�\���	��	��Ո^ܝ���	�^X�]]�H�[[X\�H�\ܝ���	�]Z[Y\��\��Y[��\ܝ���K�X\

][KJHO�
�H�^O^�_H�\�Ә[YOH��^][\�\�\��\Lȏ���X���\��L��\�Ә[YOH��MHMH^X[X�\�ML�^\��[��L]L�H�ς��[��\�Ә[YOH�^Yܘ^KM�^\�H���][_O��[����O��
J_B��[���]ۂ�ې�X��^�
HO���[Y[���][[Y[��RY
	��۝X�	�O˜�ܛ�[�՚Y]���Z]�[܎�	��[��	�J_B��\�Ә[YOH������Y�[^X�[�\�M�KL���X[X�\�Mݙ\����X[X�\�ML^]�]H�۝X����[�Y[��[��][ۈ�Y��\�H����[��\�X��]�[Z][B�؝]ۏ���]����]����]�����X�[ۏ��
NB���[��[ۈ�۝X��X�[ۊ
H�ۜ�ٛܛK�]�ܛWHH\�T�]J��[YN�	��[XZ[�	��Y\��Y�N�	��JN�ۜ���]\��]�]\�HH\�T�]J�[
N���	��[�[���	��[�	�	�\��܉��ۜ�[�T�X�Z]H\�[��
JHO�K��]�[�Y�][

N�]�]\�	��[�[���N��ۜ��\��܈HH]�Z]�\X�\�B�����J	��۝X���X�Z\��[ۜ��B��[��\�
�[YN��ܛK��[YK�[XZ[��ܛK�[XZ[�Y\��Y�N��ܛK�Y\��Y�K�JN�Y�
\��܊H�ۜ��K�\��܊	��۝X��ܛH\��܎��\��܊N�]�]\�	�\��܉�NH[�H�]�]\�	��[�	�N�]�ܛJ��[YN�	��[XZ[�	��Y\��Y�N�	��JNB�N��]\��
��X�[ۈYH��۝X���\�Ә[YOH�KLM��N�KL���]�]H���]��\�Ә[YOH�X^]�L�^X]]�M�N�M�ΜN���]��\�Ә[YOH�^X�[�\�X�LL�����\�Ә[YOH�^L��N�^M�۝X��^Yܘ^KNLX�M��]	��[������\�Ә[YOH�^[�^Yܘ^KM�����]\�[�H]�H]Y\�[ۜ�X��]H��[Y]�ܚ��[�H�[���Y�܈�YY[�[�\��][��[�\��\�[�8�%�IܙH\�H�[������]������]\�OOH	��[�	��
�]��\�Ә[YOH�^X�[�\�KLL���YܙY[�ML��[�YL��ܙ\��ܙ\�YܙY[�L�����X���\��L��\�Ә[YOH��LL�LL�^YܙY[�ML^X]]�X�M�ς���\�Ә[YOH�^^�۝X��^Yܘ^KNLX�L���Y\��Y�H�[��ς��\�Ә[YOH�^Yܘ^KM����I��]�X���[�H�][���\�ˏ����]���
H�
��ܛH۔�X�Z]^�[�T�X�Z]H�\�Ә[YOH��X�K^KMH���]���X�[�\�Ә[YOH�����^\�H�۝[YY][H^Yܘ^KM�X�LH���[YO�X�[��[�]�\OH�^���\]Z\�Y��[YO^ٛܛK��[Y_B�ې�[��O^�JHO��]�ܛJ�����ܛK�[YN�K�\��]��[YHJ_B��\�Ә[YOH��Y�[MKL��ܙ\��ܙ\�Yܘ^KL���[�Y[����\Μ�[��L����\Μ�[��X[X�\�M���\Θ�ܙ\�X[X�\�M�][�K[�ۙH�[��][ۈ��X�Z�\�H�[�\��[YH��ς��]���]���X�[�\�Ә[YOH�����^\�H�۝[YY][H^Yܘ^KM�X�LH��[XZ[�X�[��[�]�\OH�[XZ[���\]Z\�Y��[YO^ٛܛK�[XZ[B�ې�[��O^�JHO��]�ܛJ�����ܛK[XZ[�K�\��]��[YHJ_B��\�Ә[YOH��Y�[MKL��ܙ\��ܙ\�Yܘ^KL���[�Y[����\Μ�[��L����\Μ�[��X[X�\�M���\Θ�ܙ\�X[X�\�M�][�K[�ۙH�[��][ۈ��X�Z�\�H�[�\�[XZ[���H��ς��]���]���X�[�\�Ә[YOH�����^\�H�۝[YY][H^Yܘ^KM�X�LH��Y\��Y�O�X�[��^\�XB��\]Z\�Y�����^�_B��[YO^ٛܛK�Y\��Y�_B�ې�[��O^�JHO��]�ܛJ�����ܛKY\��Y�N�K�\��]��[YHJ_B��\�Ә[YOH��Y�[MKL��ܙ\��ܙ\�Yܘ^KL���[�Y[����\Μ�[��L����\Μ�[��X[X�\�M���\Θ�ܙ\�X[X�\�M�][�K[�ۙH�[��][ۈ�\�^�K[�ۙH��X�Z�\�H����[��H[Ȃ�ς��]����]ۂ�\OH��X�Z]��\�X�Y^��]\�OOH	��[�[���B��\�Ә[YOH��Y�[M�KL���X[X�\�Mݙ\����X[X�\�ML\�X�Y���X[X�\�L�^]�]H�۝X����[�Y[��[��][ۈ�Y��\�H������]\�O}= 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'error' && (
              <p className="text-red-600 text-sm text-center">Something went wrong. Please try again or email us directly.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">GrowthLens</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Use</a>
            <a href="https://www.linkedin.com/in/richardgoold/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GrowthLens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <NavBar />
      <HeroSection />
      <PreviewsSection />
      <HowItWorksSection />
      <StatsBar />
      <TestimonialsSection />
      <FeaturesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

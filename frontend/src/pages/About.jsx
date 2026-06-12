import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, Sparkles, Cpu, GitFork } from 'lucide-react';

const About = () => {
  const steps = [
    { icon: <Cpu className="w-6 h-6 text-cyan-400" />, title: 'ASYMMETRICAL ROTORS', desc: 'Custom stator geometry ensures permanent polar repulsion that overrides standard magnetic locking, allowing rotor spin loops to continue infinitely.' },
    { icon: <Compass className="w-6 h-6 text-purple-400" />, title: 'FLUX COMPRESSORS', desc: 'Inductive copper conduits squeeze high-speed magnetic flux lines, focusing force directly onto rotor coils to minimize torque losses.' },
    { icon: <GitFork className="w-6 h-6 text-blue-400" />, title: 'CRYOGENIC SEALING', desc: 'Core chambers operate in air-free magnetic vacuums, completely blocking standard friction heat, dampening noise, and maximizing lifecycles.' }
  ];

  return (
    <div className="relative min-h-screen bg-white pt-28 pb-20 overflow-hidden">

      {/* Visual background lights */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Header --- */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-orbitron tracking-widest uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Point Physics Blueprint</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-orbitron font-extrabold text-3xl sm:text-5xl text-black mb-6"
          >
            THE K V V SAI ELECTRONIC REVOLUTION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-black text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Dismantling global resource combustion since 3026. Discover how we harness the fundamental magnetism of Samarium-Cobalt arrays to supply continuous clean power.
          </motion.p>
        </div>

        {/* --- Magnetic Field Working Section --- */}
        <div className="grid grid-cols-1 gap-12 mb-20">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center mb-10">
              <h4 className="font-orbitron font-bold text-xl sm:text-3xl text-blue-600 leading-tight mb-4">
                Magnetic Field Working Based on a Generator
              </h4>
            </div>

            <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="space-y-6 text-black text-sm sm:text-base leading-relaxed text-justify">
                <div className="flex items-start space-x-3">
                  <span className="text-black text-xl leading-none shrink-0 mt-0.5">•</span>
                  <p>
                    A generator is an electrical machine that converts mechanical energy into electrical energy through the principle of electromagnetic induction. The magnetic field plays a crucial role in the operation of a generator because it provides the magnetic flux required for the generation of electricity. The working principle of a generator was discovered by Michael Faraday, who stated that whenever a conductor moves through a magnetic field or experiences a change in magnetic flux, an electromotive force (EMF) is induced in the conductor. This principle forms the basis of all modern power generation systems.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-black text-xl leading-none shrink-0 mt-0.5">•</span>
                  <p>
                    In a generator, a magnetic field is created either by permanent magnets or electromagnets. The magnetic field exists between the north and south poles of the magnet and produces magnetic lines of force. A coil of wire, known as the armature winding, is placed within this magnetic field. When mechanical energy from a turbine, engine, or any other prime mover rotates the armature, the conductors of the coil cut through the magnetic lines of force. As the coil continues to rotate, the amount of magnetic flux linked with the conductor changes continuously. This changing magnetic flux induces a voltage in the coil according to Faraday's law of electromagnetic induction.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-black text-xl leading-none shrink-0 mt-0.5">•</span>
                  <p>
                    The induced voltage causes electrons within the conductor to move, creating an electric current. When the generator is connected to an external electrical circuit, this current flows through the circuit and supplies electrical power to various loads. The continuous rotation of the armature ensures a continuous change in magnetic flux, resulting in a continuous generation of electricity. In alternating current (AC) generators, the direction of current changes periodically due to the rotation of the coil, whereas in direct current (DC) generators, a commutator is used to convert the internally generated alternating current into direct current.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-black text-xl leading-none shrink-0 mt-0.5">•</span>
                  <p>
                    The strength of the magnetic field significantly affects the performance of a generator. A stronger magnetic field increases the magnetic flux and results in a higher induced voltage. Similarly, increasing the speed of rotation of the armature increases the rate at which magnetic flux is cut, thereby increasing the generated EMF. The number of turns in the armature winding also influences the amount of voltage produced. Therefore, generator designers carefully select the magnetic field strength, coil design, and rotational speed to achieve the desired electrical output.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-black text-xl leading-none shrink-0 mt-0.5">•</span>
                  <p>
                    The magnetic field not only enables the generation of electricity but also determines the efficiency and reliability of the generator. Without a magnetic field, electromagnetic induction cannot occur, and no electrical energy can be produced. For this reason, maintaining a stable and strong magnetic field is essential for effective generator operation. Modern generators used in thermal power plants, hydroelectric stations, wind farms, nuclear power plants, and industrial facilities rely on this fundamental interaction between magnetic fields and conductors to produce electricity on a large scale.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-black text-xl leading-none shrink-0 mt-0.5">•</span>
                  <p>
                    In conclusion, the magnetic field is the fundamental element that makes electricity generation possible. By providing the magnetic flux required for electromagnetic induction, it allows mechanical energy to be converted into electrical energy efficiently and continuously. The interaction between the rotating armature and the magnetic field forms the basis of generator operation and remains one of the most important principles in electrical engineering and power generation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* --- Three-Step Core Science Breakdown --- */}
        <div className="border-t border-slate-900 pt-16">
          <h2 className="font-orbitron font-bold text-center text-xl sm:text-3xl text-black mb-12">
            PHYSICS MATRIX CORE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-panel glass-panel-hover rounded-xl p-8 border border-slate-800/80 shadow-lg relative overflow-hidden"
              >
                {/* Visual accent top borders */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f2fe] to-transparent"></div>

                <div className="p-3 w-max bg-slate-100 border border-slate-800 rounded-full mb-6">
                  {step.icon}
                </div>

                <h3 className="font-orbitron font-bold text-sm tracking-wider text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-black leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;


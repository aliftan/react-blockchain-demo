import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useSpring, animated, config } from '@react-spring/web';

const BlockchainVisualizer = ({ blockchain, latestAction }) => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Blockchain Visualizer</h2>
            <div className="space-y-4">
                {blockchain.chain.map((block, index) => (
                    <AnimatedBlock
                        key={block.hash}
                        block={block}
                        index={index}
                        isLast={index === blockchain.chain.length - 1}
                        isNew={index === blockchain.chain.length - 1 && latestAction !== 'validate'}
                    />
                ))}
            </div>
        </div>
    );
};

const AnimatedBlock = ({ block, index, isLast, isNew }) => {
    const isTampered = block.data && block.data.action === 'TAMPERED';
    const isDeleted = block.data && block.data.action === 'DELETE';

    const props = useSpring({
        from: { opacity: 0, transform: 'translateY(50px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: config.gentle,
        reset: undefined,
    });

    const getBlockStyle = () => {
        if (isTampered) return 'border-red-500 bg-red-100';
        if (isDeleted) return 'border-red-300 bg-red-50';
        return 'border-gray-300 bg-white';
    };

    return (
        <animated.div style={props}>
            <div className={`border ${getBlockStyle()} rounded p-4 shadow-md`}>
                <h3 className="font-bold mb-2">Block {index}</h3>
                <p className="text-sm mb-1"><span className="font-semibold">Timestamp:</span> {new Date(block.timestamp).toLocaleString()}</p>
                <p className="text-sm mb-1"><span className="font-semibold">Hash:</span> {block.hash.substring(0, 10)}...</p>
                <p className="text-sm mb-1"><span className="font-semibold">Prev Hash:</span> {block.previousHash.substring(0, 10)}...</p>
                <div className={`mt-2 ${isDeleted ? 'line-through text-red-500' : ''}`}>
                    <p className="font-semibold text-sm">Data:</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(block.data, null, 2)}
                    </pre>
                </div>
                {isTampered && (
                    <p className="mt-2 text-red-600 font-semibold">This block has been tampered with!</p>
                )}
                {isDeleted && (
                    <p className="mt-2 text-red-500 font-semibold">This block represents a DELETE action</p>
                )}
            </div>
            {!isLast && (
                <div className="flex justify-center my-2">
                    <ArrowDown className="text-gray-500" />
                </div>
            )}
        </animated.div>
    );
};

export default BlockchainVisualizer;
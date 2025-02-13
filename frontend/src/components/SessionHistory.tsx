import ReactMarkdown from 'react-markdown';
import { Session } from '../types';

interface Props {
  sessions: Session[];
}

export function SessionHistory({ sessions }: Props) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
      <div className="divide-y divide-gray-200">
        {sessions.map((session) => (
          <div key={session._id} className="py-6 first:pt-0 last:pb-0">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Session from {new Date(session.createdAt).toLocaleString()}
              </h3>
            </div>
            
            <div className="prose prose-sm max-w-none mb-6">
              <ReactMarkdown>{session.content}</ReactMarkdown>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Analysis Report</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {session.report.categories.map((category, idx) => (
                  <div key={idx} className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{category.category}</span>
                      <span>{Math.round(category.percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <div className="mt-2">
                      <p><strong>Base Keywords:</strong> {category.baseKeywords.join(', ')}</p>
                      <p><strong>Learned Keywords:</strong> {category.learnedKeywordsList.join(', ')}</p>
                      <p><strong>URLs Found:</strong> {category.urls.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {session.report.concerns.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Concerns</h5>
                  <ul className="list-disc list-inside text-gray-700">
                    {session.report.concerns.map((concern, index) => (
                      <li key={index}>{concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {session.report.recommendations.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                  <ul className="list-disc list-inside text-gray-700">
                    {session.report.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {session.report.urls.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Analyzed URLs</h5>
                  <div className="space-y-2">
                    {session.report.urls.map((url, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg">
                        <a 
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {url.title || url.url}
                        </a>
                        {url.summary && (
                          <p className="text-sm text-gray-600 mt-1">{url.summary}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
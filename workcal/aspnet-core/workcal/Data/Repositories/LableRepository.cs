using Microsoft.EntityFrameworkCore;
using workcal.Entities;

namespace workcal.Data.Repositories
{
    public class LabelRepository : ILabelRepository
    {
        private readonly workcalDbContext _context;

        public LabelRepository(workcalDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Label>> GetAllLabelsAsync()
        {
            return await _context.Labels.ToListAsync();
        }

        public async Task<Label> GetLabelByIdAsync(Guid id)
        {
            return await _context.Labels.FindAsync(id);
        }

        public async Task AddLabelAsync(Label labelEntity)
        {
            await _context.Labels.AddAsync(labelEntity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateLabelAsync(Label labelEntity)
        {
            _context.Labels.Update(labelEntity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteLabelAsync(Guid id)
        {
            var labelEntity = await _context.Labels.FindAsync(id);
            if (labelEntity != null)
            {
                _context.Labels.Remove(labelEntity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
